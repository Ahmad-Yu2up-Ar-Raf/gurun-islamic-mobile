import 'package:flutter/material.dart';
import 'package:forui_lucide/forui_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/providers.dart';
import '../../../core/app_scaffold.dart';
import '../../../core/state_views.dart';
import '../../../core/themed_text.dart';

/// Authenticated hadith list.
class HadistView extends ConsumerWidget {
  const HadistView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(hadistListProvider);
    return AppScaffold(
      title: 'Hadist',
      leading: const BackButton(),
      edgePadding: 20,
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(hadistListProvider),
        child: async.when(
          data: (list) => ListView.builder(
            padding: const EdgeInsets.only(top: 10, bottom: 100),
            itemCount: list.length,
            itemBuilder: (context, index) {
              final hadist = list[index];
              return _HadistCard(
                no: hadist.no,
                judul: hadist.judul,
                arab: hadist.arab,
                indo: hadist.indo,
              );
            },
          ),
          loading: () => const LoadingState(),
          error: (e, _) => ErrorState(
            title: 'Gagal memuat data hadist',
            message: '$e',
            onRetry: () => ref.invalidate(hadistListProvider),
          ),
        ),
      ),
    );
  }
}

class _HadistCard extends StatelessWidget {
  const _HadistCard({
    required this.no,
    required this.judul,
    required this.arab,
    required this.indo,
  });

  final String no;
  final String judul;
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
            children: [
              Expanded(
                child: Row(
                  children: [
                    ThemedText(no, variant: TextVariant.headline),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ThemedText(judul, variant: TextVariant.subhead),
                    ),
                  ],
                ),
              ),
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
