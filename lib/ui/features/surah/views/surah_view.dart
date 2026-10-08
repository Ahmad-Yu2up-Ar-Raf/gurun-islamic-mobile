import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:forui_lucide/forui_lucide.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_colors.dart';
import '../../../../app/providers.dart';
import '../../../core/state_views.dart';
import '../../../core/themed_text.dart';

/// Surah detail: floating header + basmalah header + ayat cards.
/// Play buttons render visually but are inert (Wave 2 owns audio).
class SurahView extends ConsumerWidget {
  const SurahView({super.key, required this.id});

  final int id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (id < 1 || id > 114) {
      WidgetsBinding.instance.addPostFrameCallback((_) => context.go('/quran'));
      return const SizedBox.shrink();
    }
    final async = ref.watch(surahDetailProvider(id));
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      body: async.when(
        data: (surah) => CustomScrollView(
          slivers: [
            SliverAppBar(
              floating: true,
              backgroundColor: scheme.surface.withValues(alpha: 0.9),
              leading: IconButton(
                icon: const Icon(Icons.chevron_left),
                onPressed: () => context.pop(),
              ),
              title: ThemedText(surah.namaLatin, variant: TextVariant.headline),
              actions: [
                IconButton(
                  icon: const Icon(Icons.settings_outlined),
                  onPressed: () {},
                ),
              ],
            ),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(24, 16, 24, 100),
              sliver: SliverList.builder(
                itemCount: surah.ayat.length + 1,
                itemBuilder: (context, index) {
                  if (index == 0) {
                    return _SuraHeader(
                      namaLatin: surah.namaLatin,
                      arti: surah.arti,
                      jumlahAyat: surah.jumlahAyat,
                    );
                  }
                  final ayat = surah.ayat[index - 1];
                  return _AyatCard(
                    ref: '${surah.nomor}:${ayat.nomorAyat}',
                    arab: ayat.teksArab,
                    latin: ayat.teksLatin,
                    indonesia: ayat.teksIndonesia,
                  );
                },
              ),
            ),
          ],
        ),
        loading: () => const LoadingState(message: 'Memuat data surah...'),
        error: (e, _) => _SurahError(name: 'Surah', message: '$e'),
      ),
    );
  }
}

class _SuraHeader extends StatelessWidget {
  const _SuraHeader({
    required this.namaLatin,
    required this.arti,
    required this.jumlahAyat,
  });

  final String namaLatin;
  final String arti;
  final int jumlahAyat;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final bright = Theme.brightnessOf(context) == Brightness.light;
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.only(top: 16, bottom: 20),
      decoration: BoxDecoration(
        color: scheme.surfaceContainer,
        borderRadius: BorderRadius.circular(AppRadius.lg),
      ),
      child: Column(
        children: [
          ThemedText(
            namaLatin,
            variant: TextVariant.title,
            color: scheme.secondary,
            align: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 64),
            child: ThemedText(
              '$arti • $jumlahAyat Ayah',
              variant: TextVariant.caption,
              color: scheme.onSurfaceVariant,
              align: TextAlign.center,
            ),
          ),
          const SizedBox(height: 12),
          SvgPicture.asset(
            bright ? 'assets/svg/basmalah.svg' : 'assets/svg/basmalah_dark.svg',
            width: MediaQuery.sizeOf(context).width * 0.6,
          ),
        ],
      ),
    );
  }
}

class _AyatCard extends ConsumerWidget {
  const _AyatCard({
    required this.ref,
    required this.arab,
    required this.latin,
    required this.indonesia,
  });

  final String ref;
  final String arab;
  final String latin;
  final String indonesia;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scheme = Theme.of(context).colorScheme;
    final saved = ref.watch(bookmarkProvider).contains(this.ref);
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 16),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: scheme.onSurfaceVariant.withValues(alpha: 0.1),
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CountPill(label: this.ref),
              const Icon(FLucideIcons.ellipsis, size: 16),
            ],
          ),
          const SizedBox(height: 28),
          ArabicText(arab),
          const SizedBox(height: 28),
          ThemedText(
            latin,
            variant: TextVariant.subhead,
            color: scheme.secondary,
          ),
          const SizedBox(height: 8),
          ThemedText(
            indonesia,
            variant: TextVariant.subhead,
            color: scheme.onSurfaceVariant,
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              // Inert by design: audio arrives in Wave 2.
              Icon(FLucideIcons.play, size: 20, color: scheme.onSurfaceVariant),
              const SizedBox(width: 20),
              GestureDetector(
                onTap: () =>
                    ref.read(bookmarkProvider.notifier).toggle(this.ref),
                child: Icon(
                  FLucideIcons.bookmark,
                  size: 20,
                  color: saved ? scheme.primary : scheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(width: 20),
              Icon(
                FLucideIcons.share2,
                size: 20,
                color: scheme.onSurfaceVariant,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SurahError extends StatelessWidget {
  const _SurahError({required this.name, required this.message});

  final String name;
  final String message;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 320),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 64),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ThemedText(
                  'Gagal memuat $name',
                  variant: TextVariant.headline,
                  align: TextAlign.center,
                ),
                const SizedBox(height: 8),
                ThemedText(
                  message,
                  variant: TextVariant.subhead,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                  align: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: AppButton(label: 'Coba lagi', onPressed: () {}),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: AppButton(
                        label: 'Kembali',
                        ghost: true,
                        onPressed: () => context.pop(),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
