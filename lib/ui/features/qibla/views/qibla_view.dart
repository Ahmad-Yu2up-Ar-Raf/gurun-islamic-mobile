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

const _compassSize = 328.0;

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
    final glowRadius = _compassSize * 0.55;
    final needleScale = _compassSize / 292.0 * 1.15; // scale with compass
    final needleOffsetY = -27.1 * (_compassSize / 292.0); // proportional offset

    return LayoutBuilder(
      builder: (context, constraints) {
        return SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: constraints.maxHeight),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 12),
                // Top decorative chevron (RN polygon marker above the dial).
                RepaintBoundary(
                  child: SvgPicture.asset(
                    'assets/svg/qibla_pollygon.svg',
                    width: 16,
                    height: 14,
                    colorFilter: ColorFilter.mode(
                      scheme.primary.withValues(alpha: 0.7),
                      BlendMode.srcIn,
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                // Full-width gold band + centered dial. The band is
                // edge-to-edge (AppScaffold edgePadding is 0 for this
                // screen); the dial stays geometrically centered.
                SizedBox(
                  width: double.infinity,
                  height: _compassSize + 80,
                  child: Stack(
                    alignment: Alignment.center,
                    clipBehavior: Clip.none,
                    children: [
                      // Full-bleed vertical fade: transparent edges, rich
                      // gold core with smoother transitions (mirrors RN
                      // Expo glow streak).
                      Positioned.fill(
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                scheme.surface.withValues(alpha: 0),
                                scheme.primary.withValues(alpha: 0.18),
                                scheme.primary.withValues(alpha: 0.28),
                                scheme.primary.withValues(alpha: 0.18),
                                scheme.surface.withValues(alpha: 0),
                              ],
                              stops: const [0.0, 0.22, 0.5, 0.78, 1.0],
                            ),
                          ),
                        ),
                      ),
                      // Central radial aura behind the dial — softer,
                      // wider, more premium.
                      Container(
                        width: _compassSize + glowRadius * 1.6,
                        height: _compassSize + glowRadius * 1.2,
                        decoration: BoxDecoration(
                          gradient: RadialGradient(
                            radius: 0.75,
                            colors: [
                              scheme.primary.withValues(alpha: 0.18),
                              scheme.primary.withValues(alpha: 0.10),
                              scheme.primary.withValues(alpha: 0.04),
                              scheme.surface.withValues(alpha: 0),
                            ],
                            stops: const [0, 0.35, 0.65, 1],
                          ),
                        ),
                      ),
                      // Subtle inner ring highlight for depth.
                      Container(
                        width: _compassSize + 6,
                        height: _compassSize + 6,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: scheme.primary.withValues(alpha: 0.08),
                            width: 1,
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
                                              alpha: 0.55,
                                            ),
                                      width: 4,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: scheme.primary.withValues(
                                          alpha: facing ? 0.25 : 0.12,
                                        ),
                                        blurRadius: facing ? 16 : 8,
                                        spreadRadius: facing ? 2 : 0,
                                      ),
                                    ],
                                  ),
                                  child: const _RingLabels(),
                                ),
                              ),
                            ),
                            // Layer 2: qibla needle — scaled with compass,
                            // centered on its circle pivot.
                            Transform.rotate(
                              angle: degreeToRadian(rotation),
                              child: RepaintBoundary(
                                child: Transform.translate(
                                  offset: Offset(0, needleOffsetY),
                                  child: SvgPicture.asset(
                                    'assets/svg/qibla_arrow.svg',
                                    width: 46 * needleScale,
                                  ),
                                ),
                              ),
                            ),
                            // Layer 1: Kaaba marker pinned on the ring
                            // (surface-filled circle + primary border).
                            Positioned(
                              top: -20,
                              child: Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: scheme.surface,
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: scheme.primary,
                                    width: 2,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: scheme.primary.withValues(
                                        alpha: 0.2,
                                      ),
                                      blurRadius: 8,
                                      spreadRadius: 0,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: Center(
                                  child: SvgPicture.asset(
                                    'assets/svg/tab_kabbah.svg',
                                    width: 20,
                                    height: 20,
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
                const SizedBox(height: 30),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: ThemedText(
                    '${bearing.round()}°',
                    variant: TextVariant.title,
                    align: TextAlign.center,
                    weight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 6),
                ThemedText(
                  'Device angle to qibla',
                  variant: TextVariant.caption,
                  color: scheme.onSurfaceVariant,
                  align: TextAlign.center,
                ),
                const SizedBox(height: 28),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 14,
                    ),
                    decoration: BoxDecoration(
                      color: scheme.secondary.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: scheme.secondary.withValues(alpha: 0.25),
                        width: 1,
                      ),
                    ),
                    child: ThemedText(
                      facing
                          ? '✓ Facing Qibla'
                          : 'Rotate the phone ${rotation.abs().round()}° '
                                'to the ${rotation > 0 ? 'right' : 'left'}',
                      variant: TextVariant.caption,
                      color: scheme.secondary,
                      align: TextAlign.center,
                      weight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: 28),
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
    // Scale dots and label padding with compass size.
    final radius = _compassSize / 2;
    final labelInset = 28.0;
    final dotRadius = 5.0;
    final dotDistance = radius - 22; // distance from center to dot center
    final dotOffset = dotDistance / 1.41421356; // 45° diagonal

    Text label(String s) => Text(
      s,
      style: TextStyle(
        fontFamily: 'Poppins',
        fontWeight: FontWeight.w700,
        fontSize: 18,
        color: scheme.onSurface,
        letterSpacing: 0.2,
      ),
    );

    Widget dot(double dx, double dy) => Positioned(
      left: radius + dx - dotRadius,
      top: radius + dy - dotRadius,
      child: Container(
        width: dotRadius * 2,
        height: dotRadius * 2,
        decoration: BoxDecoration(
          color: scheme.primary.withValues(alpha: 0.75),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: scheme.primary.withValues(alpha: 0.35),
              blurRadius: 4,
              spreadRadius: 0.5,
            ),
          ],
        ),
      ),
    );

    return Stack(
      clipBehavior: Clip.none,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(
            horizontal: labelInset,
            vertical: labelInset,
          ),
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
        dot(dotOffset, -dotOffset),
        dot(-dotOffset, -dotOffset),
        dot(dotOffset, dotOffset),
        dot(-dotOffset, dotOffset),
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
