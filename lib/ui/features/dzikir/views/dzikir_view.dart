import 'package:flutter/material.dart';
import 'package:forui_lucide/forui_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/providers.dart';
import '../../../core/app_scaffold.dart';
import '../../../core/filter_chips.dart';
import '../../../core/state_views.dart';
import '../../../core/themed_text.dart';

const _filterOptions = [
  FilterOption(label: 'Pagi', value: 'pagi'),
  FilterOption(label: 'Shalat', value: 'solat'),
  FilterOption(label: 'Sore', value: 'sore'),
];

/// Dzikir list with multi-select type carousel.
class DzikirView extends ConsumerWidget {
  const DzikirView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(dzikirListProvider);
    final selected = ref.watch(dzikirFilterProvider);
    return AppScaffold(
      title: 'Dzikir',
      leading: const BackButton(),
      edgePadding: 20,
      belowHeader: Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: FilterCarousel(
          options: _filterOptions,
          selected: selected,
          onChanged: (next) =>
              ref.read(dzikirFilterProvider.notifier).set(next),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(dzikirListProvider),
        child: async.when(
          data: (list) => list.isEmpty
              ? EmptyState(
                  message: selected.isEmpty
                      ? 'Tidak ada data'
                      : 'Tidak ada dzikir untuk filter yang dipilih',
                )
              : ListView.builder(
                  padding: const EdgeInsets.only(top: 10, bottom: 100),
                  itemCount: list.length,
                  itemBuilder: (context, index) {
                    final item = list[index];
                    return _DzikirCard(
                      badge: '${item.ulang} - ${item.type}',
                      arab: item.arab,
                      indo: item.indo,
                    );
                  },
                ),
          loading: () => const LoadingState(),
          error: (e, _) => ErrorState(
            title: 'Gagal memuat data dzikir',
            message: '$e',
            onRetry: () => ref.invalidate(dzikirListProvider),
          ),
        ),
      ),
    );
  }
}

class _DzikirCard extends StatelessWidget {
  const _DzikirCard({
    required this.badge,
    required this.arab,
    required this.indo,
  });

  final String badge;
  final String arab;
  final String indo;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.fromLTRB(4, 0, 4, 24),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: scheme.outline)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CountPill(label: badge),
              const Icon(FLucideIcons.ellipsis, size: 16),
            ],
          ),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.only(left: 32),
            child: ArabicText(arab, fontSize: 18, maxLines: 2),
          ),
          const SizedBox(height: 12),
          ThemedText(
            indo,
            variant: TextVariant.caption,
            color: scheme.onSurfaceVariant.withValues(alpha: 0.8),
            maxLines: 2,
          ),
        ],
      ),
    );
  }
}
