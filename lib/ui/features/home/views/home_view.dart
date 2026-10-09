import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:forui_lucide/forui_lucide.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_colors.dart';
import '../../../../app/providers.dart';
import '../../../../app/theme.dart';
import '../../../../domain/use_cases/prayer_schedule.dart';
import '../../../core/app_scaffold.dart';
import '../../../core/state_views.dart';
import '../../../core/themed_text.dart';

/// 1-second countdown state derived from today's schedule.
class CountdownState {
  const CountdownState({
    required this.nextLabel,
    required this.remaining,
    required this.city,
    required this.dateString,
  });

  final String nextLabel;
  final String remaining;
  final String city;
  final String dateString;
}

class CountdownNotifier extends Notifier<CountdownState> {
  Timer? _timer;

  @override
  CountdownState build() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) => _tick());
    ref.onDispose(() => _timer?.cancel());
    return _compute();
  }

  void _tick() {
    state = _compute();
  }

  CountdownState _compute() {
    final now = DateTime.now();
    final region = ref.watch(regionProvider);
    final schedule = ref.watch(todayScheduleProvider).value;
    if (schedule == null || schedule.isEmpty) {
      return CountdownState(
        nextLabel: '',
        remaining: '00:00:00',
        city: region.city,
        dateString: formatDateId(now),
      );
    }
    final tomorrow = ref.watch(tomorrowJadwalProvider).value;
    final next = nextPrayerTarget(schedule, now, tomorrow: tomorrow);
    return CountdownState(
      nextLabel: next.label,
      remaining: formatDuration(next.target.difference(now)),
      city: region.city,
      dateString: formatDateId(now),
    );
  }
}

final countdownProvider = NotifierProvider<CountdownNotifier, CountdownState>(
  CountdownNotifier.new,
);

/// Home = hero clock + prayer-times carousel (1:1 with RN `HomeBlock`).
class HomeView extends ConsumerWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final countdown = ref.watch(countdownProvider);
    final now = DateTime.now();
    return AppScaffold(
      title: 'Gurun',
      edgePadding: 0,
      leading: Builder(
        builder: (context) => IconButton(
          icon: const Icon(FLucideIcons.menu),
          onPressed: openSheetMenu,
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(FLucideIcons.settings),
          onPressed: () => context.go('/settings'),
        ),
      ],
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: _HeroClock(now: now, state: countdown),
          ),
          // RN hero `mb-16` breathing room before the carousel.
          const SliverToBoxAdapter(child: SizedBox(height: 48)),
          // Header keeps screen-edge inset; the carousel itself runs
          // full-bleed so cards scroll edge-to-edge (content padding
          // preserves the first/last card inset).
          const SliverToBoxAdapter(child: _PrayerSection()),
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

/// `PrayTimeSection` port: header + horizontal 5-card carousel fed by
/// `todayScheduleProvider` (replaces the non-RN `Fitur` menu).
class _PrayerSection extends ConsumerWidget {
  const _PrayerSection();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final schedule = ref.watch(todayScheduleProvider);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: ThemedText('Prayer Times', variant: TextVariant.title),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 148,
          child: schedule.when(
            data: (items) => ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: items.length,
              separatorBuilder: (_, _) => const SizedBox(width: 8),
              itemBuilder: (context, i) => _PrayTimeCard(item: items[i]),
            ),
            loading: () =>
                const LoadingState(message: 'Memuat jadwal shalat...'),
            error: (e, _) => ErrorState(
              title: 'Gagal memuat jadwal shalat',
              message: '$e',
              onRetry: () => ref.invalidate(todayScheduleProvider),
            ),
          ),
        ),
      ],
    );
  }
}

class _PrayTimeCard extends StatelessWidget {
  const _PrayTimeCard({required this.item});

  final PrayerScheduleItem item;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      width: 105,
      padding: const EdgeInsets.symmetric(vertical: 18),
      decoration: BoxDecoration(
        color: scheme.surfaceContainer.withValues(alpha: 0.4),
        borderRadius: BorderRadius.circular(AppRadius.lg),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SvgPicture.asset(
            'assets/svg/prayer_sun.svg',
            width: 30,
            height: 30,
            colorFilter: ColorFilter.mode(scheme.primary, BlendMode.srcIn),
          ),
          const SizedBox(height: 12),
          ThemedText(
            item.label,
            variant: TextVariant.body,
            weight: FontWeight.w500,
          ),
          const SizedBox(height: 4),
          ThemedText(
            item.time.length >= 5 ? item.time.substring(0, 5) : item.time,
            variant: TextVariant.headline,
          ),
        ],
      ),
    );
  }
}

/// Renders the hero mosque one frame late (see note at the call site).
class _DeferredMosque extends StatefulWidget {
  const _DeferredMosque();

  @override
  State<_DeferredMosque> createState() => _DeferredMosqueState();
}

class _DeferredMosqueState extends State<_DeferredMosque> {
  var _ready = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) setState(() => _ready = true);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_ready) return const SizedBox.shrink();
    final scheme = Theme.of(context).colorScheme;
    // 1.25x keeps the silhouette dominant at the hero base (RN scale-110
    // minimum). Stacking stays glow < mosque < fade < clock < info row:
    // the opaque vector must never cover the clock/timer (`home.png`).
    return Transform.scale(
      scale: 1.25,
      child: SvgPicture.asset(
        'assets/svg/mosque.svg',
        width: MediaQuery.sizeOf(context).width,
        colorFilter: ColorFilter.mode(scheme.surfaceContainer, BlendMode.srcIn),
      ),
    );
  }
}

class _HeroClock extends StatelessWidget {
  const _HeroClock({required this.now, required this.state});

  final DateTime now;
  final CountdownState state;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final hour = now.hour.toString().padLeft(2, '0');
    final minute = now.minute.toString().padLeft(2, '0');
    return SizedBox(
      height: MediaQuery.sizeOf(context).width * 0.76,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Radial gold glow (RN `BackgroundGradient`: 52% → 60%/.8 → bg,
          // centered at 88% height, radius 90% width).
          Container(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: const Alignment(0, 0.76),
                radius: 0.9,
                colors: [
                  const Color(0xFFFFA10A),
                  const Color(0xFFFFB133).withValues(alpha: 0.8),
                  scheme.surface,
                ],
                stops: const [0, 0.55, 1],
              ),
            ),
          ),
          // Mosque silhouette (RN `MosqueBackground`, card-tinted,
          // -bottom-6, scale-110). Deferred past the first frame: the
          // 164KB vector's maiden raster on software GL would otherwise
          // block the main thread during plugin/service startup (ANR).
          const Positioned(
            left: 0,
            right: 0,
            bottom: -24,
            child: _DeferredMosque(),
          ),
          // Fade gradient melting the mosque base into the background
          // (RN `LinearGradient` card → background).
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            height: 120,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [scheme.surface.withValues(alpha: 0), scheme.surface],
                ),
              ),
            ),
          ),
          Row(
            children: [
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(right: 28),
                  child: Text(
                    hour,
                    textAlign: TextAlign.right,
                    style: schluberStyle(context: context, fontSize: 88),
                  ),
                ),
              ),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(left: 28),
                  child: Text(
                    minute,
                    style: schluberStyle(context: context, fontSize: 88),
                  ),
                ),
              ),
            ],
          ),
          Text(':', style: schluberStyle(context: context, fontSize: 88)),
          Positioned(
            bottom: 20,
            left: 0,
            right: 0,
            child: Row(
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        ThemedText(
                          'remaining time',
                          variant: TextVariant.caption,
                          color: scheme.onSurfaceVariant,
                          uppercase: true,
                        ),
                        ThemedText(
                          '${state.nextLabel} ${state.remaining}',
                          variant: TextVariant.headline,
                        ),
                      ],
                    ),
                  ),
                ),
                Container(
                  width: 2,
                  height: 44,
                  color: scheme.secondary.withValues(alpha: 0.1),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(left: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ThemedText(
                          state.dateString,
                          variant: TextVariant.caption,
                          color: scheme.onSurfaceVariant,
                          uppercase: true,
                          maxLines: 1,
                        ),
                        ThemedText(
                          state.city,
                          variant: TextVariant.headline,
                          maxLines: 1,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
