import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/providers.dart';
import '../../../core/app_scaffold.dart';
import '../../../core/state_views.dart';
import '../../../core/themed_text.dart';

/// Daily duas list.
class DoaView extends ConsumerWidget {
  const DoaView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(doaListProvider);
    return AppScaffold(
      title: 'Doa',
      leading: const BackButton(),
      edgePadding: 20,
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(doaListProvider),
        child: async.when(
          data: (list) => ListView.builder(
            padding: const EdgeInsets.only(top: 10, bottom: 100),
            itemCount: list.length,
            itemBuilder: (context, index) {
              final doa = list[index];
              return _DoaCard(
                id: '${doa.id}',
                judul: doa.judul,
                arab: doa.arab,
                latin: doa.latin,
                terjemah: doa.terjemah,
              );
            },
          ),
          loading: () => const LoadingState(),
          error: (e, _) => ErrorState(
            title: 'Gagal memuat data doa',
            message: '$e',
            onRetry: () => ref.invalidate(doaListProvider),
          ),
        ),
      ),
    );
  }
}

class _DoaCard extends StatelessWidget {
  const _DoaCard({
    required this.id,
    required this.judul,
    required this.arab,
    required this.latin,
    required this.terjemah,
  });

  final String id;
  final String judul;
  final String arab;
  final String latin;
  final String terjemah;

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
                    ThemedText(id, variant: TextVariant.headline),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ThemedText(judul, variant: TextVariant.subhead),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.more_horiz, size: 16),
            ],
          ),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.only(left: 32),
            child: ArabicText(arab, fontSize: 18, maxLines: 2),
          ),
          const SizedBox(height: 12),
          ThemedText(
            latin,
            variant: TextVariant.caption,
            color: scheme.onSurfaceVariant.withValues(alpha: 0.8),
            maxLines: 2,
          ),
          ThemedText(
            'Meaning: $terjemah',
            variant: TextVariant.caption,
            color: scheme.onSurfaceVariant.withValues(alpha: 0.8),
            maxLines: 2,
          ),
        ],
      ),
    );
  }
}
