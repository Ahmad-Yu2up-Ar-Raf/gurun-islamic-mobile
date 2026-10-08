import 'package:flutter/material.dart';
import 'package:forui_lucide/forui_lucide.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/providers.dart';
import '../../../core/app_scaffold.dart';
import '../../../core/state_views.dart';
import '../../../core/themed_text.dart';

/// Quran list: progress header + Surah/Juz/Page tabs + surah rows.
class QuranView extends ConsumerWidget {
  const QuranView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(quranListProvider);
    return AppScaffold(
      title: 'Quran',
      leading: Builder(
        builder: (context) => IconButton(
          icon: const Icon(FLucideIcons.menu),
          onPressed: () => Scaffold.of(context).openDrawer(),
        ),
      ),
      edgePadding: 20,
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(quranListProvider),
        child: async.when(
          data: (list) => ListView.builder(
            padding: const EdgeInsets.only(top: 25, bottom: 100),
            itemCount: list.length + 1,
            itemBuilder: (context, index) {
              if (index == 0) return const _QuranHeader();
              final surah = list[index - 1];
              return _SurahRow(
                nomor: surah.nomor,
                namaLatin: surah.namaLatin,
                nama: surah.nama,
                tempatTurun: surah.tempatTurun,
                jumlahAyat: surah.jumlahAyat,
                onTap: () => context.push('/quran/${surah.nomor}'),
              );
            },
          ),
          loading: () => const LoadingState(),
          error: (e, _) => ErrorState(
            title: e.toString(),
            onRetry: () => ref.invalidate(quranListProvider),
          ),
        ),
      ),
    );
  }
}

class _QuranHeader extends StatelessWidget {
  const _QuranHeader();

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        _ProgressCard(),
        SizedBox(height: 24),
        _SectionTabs(),
        SizedBox(height: 8),
      ],
    );
  }
}

class _ProgressCard extends StatelessWidget {
  const _ProgressCard();

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Container(
        height: 125,
        width: double.infinity,
        color: scheme.surfaceContainer,
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ThemedText(
                    'Daily Quran',
                    variant: TextVariant.caption,
                    color: scheme.onSurface.withValues(alpha: 0.7),
                  ),
                  TekoText('Bismillah', fontSize: 36, color: scheme.secondary),
                  ThemedText(
                    'Time to recite',
                    variant: TextVariant.caption,
                    color: scheme.onSurfaceVariant,
                  ),
                ],
              ),
            ),
            Positioned(
              right: -10,
              bottom: -40,
              child: SvgPicture.asset(
                'assets/svg/quran_rehal.svg',
                width: 176,
                height: 140,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionTabs extends StatefulWidget {
  const _SectionTabs();

  @override
  State<_SectionTabs> createState() => _SectionTabsState();
}

class _SectionTabsState extends State<_SectionTabs> {
  var _selected = 0;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    const labels = ['Surah', 'Juz', 'Page'];
    return Row(
      children: [
        for (var i = 0; i < labels.length; i++)
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _selected = i),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  border: _selected == i
                      ? Border(
                          bottom: BorderSide(color: scheme.secondary, width: 2),
                        )
                      : null,
                ),
                child: Text(
                  labels[i],
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: i == _selected
                        ? FontWeight.w700
                        : FontWeight.w400,
                    color: scheme.secondary,
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _SurahRow extends StatelessWidget {
  const _SurahRow({
    required this.nomor,
    required this.namaLatin,
    required this.nama,
    required this.tempatTurun,
    required this.jumlahAyat,
    required this.onTap,
  });

  final int nomor;
  final String namaLatin;
  final String nama;
  final String tempatTurun;
  final int jumlahAyat;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 4),
        decoration: BoxDecoration(
          border: Border(bottom: BorderSide(color: scheme.outline)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                SizedBox(
                  width: 40,
                  height: 40,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Text(
                        '۝',
                        style: TextStyle(
                          // U+06DD lives in the Arabic font, not Poppins.
                          fontFamily: 'Arabic',
                          fontWeight: FontWeight.w600,
                          fontSize: 30,
                          color: scheme.secondary,
                        ),
                      ),
                      Text(
                        '$nomor',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.w600,
                          fontSize: 11,
                          color: scheme.secondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 24),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ThemedText(namaLatin, variant: TextVariant.body),
                    Row(
                      children: [
                        ThemedText(
                          tempatTurun,
                          variant: TextVariant.subhead,
                          color: scheme.onSurfaceVariant,
                        ),
                        ThemedText(
                          ' • $jumlahAyat Ayah',
                          variant: TextVariant.subhead,
                          color: scheme.onSurfaceVariant,
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
            ArabicText(nama, fontSize: 20, color: scheme.secondary),
          ],
        ),
      ),
    );
  }
}
