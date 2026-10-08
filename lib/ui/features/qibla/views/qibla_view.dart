import 'dart:async';

import 'package:adhan/adhan.dart';
import 'package:flutter/material.dart';
import 'package:flutter_compass/flutter_compass.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
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
      leading: Builder(
        builder: (context) => IconButton(
          icon: const Icon(Icons.menu),
          onPressed: () => Scaffold.of(context).openDrawer(),
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
    return SingleChildScrollView(
      child: Column(
        children: [
          const SizedBox(height: 24),
          SizedBox(
            width: _compassSize,
            height: _compassSize,
            child: Stack(
              alignment: Alignment.center,
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
                              : scheme.primary.withValues(alpha: 0.5),
                          width: 4,
                        ),
                      ),
                      child: const _RingLabels(),
                    ),
                  ),
                ),
                // Layer 2: qibla arrow (rotates toward bearing).
                Transform.rotate(
                  angle: degreeToRadian(rotation),
                  child: const RepaintBoundary(
                    child: Icon(Icons.navigation, size: 102),
                  ),
                ),
                // Layer 1: Kaaba marker (fixed).
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: scheme.primary),
                      ),
                      child: Icon(
                        Icons.mosque,
                        size: 15,
                        color: scheme.primary,
                      ),
                    ),
                    if (!facing)
                      Container(
                        margin: const EdgeInsets.only(top: 4),
                        width: 0,
                        height: 60,
                        decoration: BoxDecoration(
                          border: Border(
                            left: BorderSide(
                              color: scheme.primary.withValues(alpha: 0.6),
                              width: 2,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ThemedText('${bearing.round()}°', variant: TextVariant.title),
          ThemedText(
            'Device angle to qibla',
            variant: TextVariant.caption,
            color: scheme.onSurfaceVariant,
          ),
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
            ),
          ),
          const SizedBox(height: 100),
        ],
      ),
    );
  }
}

class _RingLabels extends StatelessWidget {
  const _RingLabels();

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    Text label(String s, {bool bold = false}) => Text(
      s,
      style: TextStyle(
        fontFamily: 'Poppins',
        fontWeight: bold ? FontWeight.w700 : FontWeight.w400,
        fontSize: bold ? 18 : 12,
        color: bold ? scheme.onSurface : scheme.secondary,
      ),
    );
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          label('N', bold: true),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [label('W'), label('E')],
          ),
          label('S', bold: true),
        ],
      ),
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
            onPressed: () => _openCameraMode(context),
          ),
        ],
      ),
    );
  }
}
