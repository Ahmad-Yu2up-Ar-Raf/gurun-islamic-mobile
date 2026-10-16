import 'dart:async';

import 'package:adhan/adhan.dart';
import 'package:flutter/material.dart';
import 'package:flutter_compass/flutter_compass.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:forui_lucide/forui_lucide.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../app/providers.dart';
import '../../../../data/repositories/device_repositories.dart';
import '../../../../domain/angle_math.dart';
import '../../../core/app_scaffold.dart';
import '../../../core/state_views.dart';
import '../../../core/themed_text.dart';

const _compassSize = 292.0;

/// Qibla compass: ring rotates by `-heading`, arrow by `bearing - heading`.
/// Camera-mode fallback opens the Google Qibla Finder embed.
class QiblaView extends ConsumerWidget {
  const QiblaView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final region = ref.watch(regionProvider);
    final bearing = Qibla(Coordinates(region.latitude, region.longitude))
        .direction;
    final compass = ref.watch(_compassProvider);

    return AppScaffold(
      title: 'Qibla Finder',
      edgePadding: 0,
      leading: Builder(
        builder: (context) => IconButton(
          icon: const Icon(FLucideIcons.menu),
          onPressed: openSheetMenu,
        ),
      ),
      body: compass.when(
        data: (event) {
          if (event?.heading == null) {
            return _SensorError(
              message: 'Sensor tidak tersedia.',
              region: region,
            );
          }
          final heading = normalizeAngle(-(event!.heading!));
          final rotation = shortestRotation(heading, bearing);
          return _Compass(
            bearing: bearing,
            heading: heading,
            rotation: rotation,
          );
        },
        loading: () => const LoadingState(message: 'Memuat sensor kompas...'),
        error: (e, _) => _SensorError(message: '$e', region: region),
      ),
    );
  }
}

final _compassProvider = StreamProvider<CompassEvent?>((ref) {
  final stream = FlutterCompass.events;
  if (stream == null) return Stream.value(null);
  return stream.timeout(
    const Duration(seconds: 5),
    onTimeout: (sink) => sink.addError('Sensor tidak tersedia.'),
  );
});

class _Compass extends StatelessWidget {
  const _Compass({
    required this.bearing,
    required this.heading,
    required this.rotation,
  });

  final double bearing;
  final double heading;
  final double rotation;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final facing = rotation.abs() <= 5;
    return LayoutBuilder(
      builder: (context, constraints) {
        return SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: constraints.maxHeight),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 8),
                // Top decorative chevron (RN polygon marker above the dial).
                RepaintBoundary(
                  child: SvgPicture.asset(
                    'assets/svg/qibla_pollygon.svg',
                    width: 15,
                    height: 13,
                  ),
                ),
                // Full-width gold band + centered dial. The band is
                // edge-to-edge (AppScaffold edgePadding is 0 for this
                // screen); the dial stays geometrically centered.
                SizedBox(
                  width: double.infinity,
                  height: _compassSize + 72,
                  child: Stack(
                    alignment: Alignment.center,
                    clipBehavior: Clip.none,
                    children: [
                      // Full-bleed vertical fade: transparent edges, dense
                      // gold core (echoes the RN Expo glow streak).
                      Positioned(
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                scheme.surface.withValues(alpha: 0),
                                scheme.primary.withValues(alpha: 0.32),
                                scheme.primary.withValues(alpha: 0.32),
                                scheme.surface.withValues(alpha: 0),
                              ],
                              stops: const [0.0, 0.28, 0.72, 1.0],
                            ),
                          ),
                        ),
                      ),
                      // Central radial aura behind the dial.
                      Container(
                        width: _compassSize + 88,
                        height: _compassSize + 72,
                        decoration: BoxDecoration(
                          gradient: RadialGradient(
                            radius: 0.65,
                            colors: [
                              scheme.primary.withValues(alpha: 0.22),
                              scheme.primary.withValues(alpha: 0.07),
                              scheme.surface.withValues(alpha: 0),
                            ],
                            stops: const [0, 0.6, 1],
                          ),
                        ),
                      ),
                      SizedBox(
                        width: _compassSize,
                        height: _compassSize,
                        child: Stack(
                          alignment: Alignment.center,
                          clipBehavior: Clip.none,
                          children: [
                            // Layer 3: compass ring (rotates with heading).
                            Transform.rotate(
                              angle: degreeToRadian(-heading),
                              child: RepaintBoundary(
                                child: Container(
                                  width: _compassSize,
                                  height: _compassSize,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: facing
                                          ? scheme.primary
                                          : scheme.primary.withValues(
                                              alpha: 0.5,
                                            ),
                                      width: 4,
                                    ),
                                  ),
                                  child: const _RingLabels(),
                                ),
                              ),
                            ),
                            // Layer 2: qibla needle. The SVG (40x87,
                            // circle cy 67.093) is rendered at width 46
                            // (scale ~1.15) and shifted up 27px so the
                            // circle sits exactly at the dial center; the
                            // outer rotate then pivots around that dot.
                            Transform.rotate(
                              angle: degreeToRadian(rotation),
                              child: RepaintBoundary(
                                child: Transform.translate(
                                  offset: const Offset(0, -27.1),
                                  child: SvgPicture.asset(
                                    'assets/svg/qibla_arrow.svg',
                                    width: 46,
                                  ),
                                ),
                              ),
                            ),
                            // Layer 1: Kaaba marker pinned on the ring
                            // (surface-filled circle + primary border).
                            Positioned(
                              top: -18,
                              child: Container(
                                width: 36,
                                height: 36,
                                decoration: BoxDecoration(
                                  color: scheme.surface,
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: scheme.primary,
                                    width: 1.5,
                                  ),
                                ),
                                child: Center(
                                  child: SvgPicture.asset(
                                    'assets/svg/tab_kabbah.svg',
                                    width: 18,
                                    height: 18,
                                    colorFilter: ColorFilter.mode(
                                      scheme.onSurface,
                                      BlendMode.srcIn,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 28),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: ThemedText(
                    '${bearing.round()}°',
                    variant: TextVariant.title,
                    align: TextAlign.center,
                  ),
                ),
                ThemedText(
                  'Device angle to qibla',
                  variant: TextVariant.caption,
                  color: scheme.onSurfaceVariant,
                  align: TextAlign.center,
                ),
                const SizedBox(height: 24),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      color: scheme.secondary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: ThemedText(
                      facing
                          ? '✓ Facing Qibla'
                          : 'Rotate the phone ${rotation.abs().round()}° '
                                'to the ${rotation > 0 ? 'right' : 'left'}',
                      variant: TextVariant.caption,
                      color: scheme.secondary,
                      align: TextAlign.center,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _RingLabels extends StatelessWidget {
  const _RingLabels();

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    Text label(String s) => Text(
      s,
      style: TextStyle(
        fontFamily: 'Poppins',
        fontWeight: FontWeight.w700,
        fontSize: 18,
        color: scheme.onSurface,
      ),
    );
    // ponytail: fixed 8px dots at 45° diagonals; upgrade to CustomPainter
    // if tick density ever needs to scale with dial size.
    Widget dot(double dx, double dy) => Positioned(
      left: _compassSize / 2 + dx - 4,
      top: _compassSize / 2 + dy - 4,
      child: Container(
        width: 8,
        height: 8,
        decoration: BoxDecoration(
          color: scheme.primary.withValues(alpha: 0.6),
          shape: BoxShape.circle,
        ),
      ),
    );
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              label('N'),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [label('W'), label('E')],
              ),
              label('S'),
            ],
          ),
        ),
        dot(67.9, -67.9),
        dot(-67.9, -67.9),
        dot(67.9, 67.9),
        dot(-67.9, 67.9),
      ],
    );
  }
}

class _SensorError extends StatelessWidget {
  const _SensorError({required this.message, required this.region});

  final String message;
  final DeviceRegion region;

  Future<void> _openCameraMode(BuildContext context) async {
    final r = region;
    final uri = Uri.parse(
      'https://qiblafinder.withgoogle.com/intl/en/embed'
      '?lat=${r.latitude}&lng=${r.longitude}',
    );
    await launchUrl(uri, mode: LaunchMode.inAppBrowserView);
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ThemedText('Sensor tidak tersedia', variant: TextVariant.headline),
            const SizedBox(height: 8),
            ThemedText(
              message,
              variant: TextVariant.body,
              color: scheme.onSurfaceVariant,
              align: TextAlign.center,
            ),
            const SizedBox(height: 16),
            AppButton(
              label: 'Coba Camera Mode',
              icon: const Icon(FLucideIcons.camera, size: 16),
              onPressed: () => _openCameraMode(context),
            ),
          ],
        ),
      ),
    );
  }
}
