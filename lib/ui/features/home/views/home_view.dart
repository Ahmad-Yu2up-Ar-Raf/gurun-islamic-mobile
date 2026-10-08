import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_colors.dart';
import '../../../../app/providers.dart';
import '../../../../app/theme.dart';
import '../../../../domain/use_cases/prayer_schedule.dart';
import '../../../core/app_scaffold.dart';
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
    final next = nextPrayerTarget(schedule, now);
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

/// Home = hero clock only (`PrayTimeSection` is commented out in RN).
class HomeView extends ConsumerWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final countdown = ref.watch(countdownProvider);
    final now = DateTime.now();
    return AppScaffold(
      title: 'Gurun',
      leading: Builder(
        builder: (context) => IconButton(
          icon: const Icon(Icons.menu),
          onPressed: () => Scaffold.of(context).openDrawer(),
        ),
      ),
      actions: [IconButton(icon: const Icon(Icons.search), onPressed: () {})],
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: _HeroClock(now: now, state: countdown),
          ),
          const SliverToBoxAdapter(child: _FiturMenu()),
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

/// `Fitur` menu (HomeMenuCard port): the drawer menu is commented out in
/// RN, so this section keeps Doa/Dzikir/Asmaul/Hadist reachable.
class _FiturMenu extends StatelessWidget {
  const _FiturMenu();

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    const items = [
      (Icons.wb_sunny, 'Dzikir', '/dzikir'),
      (Icons.book, 'Doa', '/doa'),
      (Icons.star, 'Asmaul Husna', '/asmaul-husna'),
      (Icons.history, 'Hadist', '/hadist'),
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: ThemedText(
            'Fitur',
            variant: TextVariant.caption,
            color: scheme.onSurfaceVariant,
            uppercase: true,
          ),
        ),
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: scheme.outline),
            borderRadius: BorderRadius.circular(AppRadius.lg),
          ),
          child: Column(
            children: [
              for (var i = 0; i < items.length; i++) ...[
                InkWell(
                  onTap: () => context.push(items[i].$3),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 16,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Icon(
                              items[i].$1,
                              size: 20,
                              color: scheme.onSurfaceVariant,
                            ),
                            const SizedBox(width: 12),
                            ThemedText(items[i].$2, variant: TextVariant.body),
                          ],
                        ),
                        Icon(
                          Icons.chevron_right,
                          size: 16,
                          color: scheme.onSurfaceVariant,
                        ),
                      ],
                    ),
                  ),
                ),
                if (i < items.length - 1)
                  Divider(height: 1, color: scheme.outline),
              ],
            ],
          ),
        ),
      ],
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
          // Radial glow behind the clock.
          Container(
            decoration: BoxDecoration(
              gradient: RadialGradient(
                center: Alignment.center,
                radius: 0.9,
                colors: [
                  scheme.primary,
                  scheme.primary.withValues(alpha: 0.8),
                  scheme.surface.withValues(alpha: 0.06),
                ],
                stops: const [0, 0.4, 0.75],
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
