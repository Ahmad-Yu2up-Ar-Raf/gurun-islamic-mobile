import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/app_colors.dart';
import '../../../../app/providers.dart';
import '../../../core/app_scaffold.dart';
import '../../../core/state_views.dart';
import '../../../core/themed_text.dart';

/// 99 Names grid (2 columns).
class AsmaulHusnaView extends ConsumerWidget {
  const AsmaulHusnaView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(asmaulHusnaListProvider);
    return AppScaffold(
      title: 'Asmaul Husna',
      leading: const BackButton(),
      edgePadding: 20,
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(asmaulHusnaListProvider),
        child: async.when(
          data: (list) => GridView.builder(
            padding: const EdgeInsets.only(top: 30, bottom: 100),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 0.85,
            ),
            itemCount: list.length,
            itemBuilder: (context, index) {
              final item = list[index];
              return _AsmaulCell(
                urutan: '${item.urutan}',
                arab: item.arab,
                latin: item.latin,
                arti: item.arti,
              );
            },
          ),
          loading: () => const LoadingState(),
          error: (e, _) => ErrorState(
            title: 'Gagal memuat data asmaulHusna',
            message: '$e',
            onRetry: () => ref.invalidate(asmaulHusnaListProvider),
          ),
        ),
      ),
    );
  }
}

class _AsmaulCell extends StatelessWidget {
  const _AsmaulCell({
    required this.urutan,
    required this.arab,
    required this.latin,
    required this.arti,
  });

  final String urutan;
  final String arab;
  final String latin;
  final String arti;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: scheme.surface,
        border: Border.all(color: scheme.outline),
        borderRadius: BorderRadius.circular(AppRadius.lg),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(child: ThemedText(urutan, variant: TextVariant.subhead)),
          ArabicText(arab, fontSize: 20),
          const SizedBox(height: 4),
          ThemedText(latin, variant: TextVariant.caption),
          ThemedText(
            arti,
            variant: TextVariant.caption,
            color: scheme.onSurfaceVariant.withValues(alpha: 0.8),
            maxLines: 1,
          ),
        ],
      ),
    );
  }
}
