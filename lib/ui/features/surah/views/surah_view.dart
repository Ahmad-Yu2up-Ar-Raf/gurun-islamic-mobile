import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:forui_lucide/forui_lucide.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/app_colors.dart';
import '../../../../app/providers.dart';
import '../../../core/state_views.dart';
import '../../../core/themed_text.dart';

/// Surah detail: pinned app bar (title fades in on scroll) + basmalah
/// header + ayat cards.
/// Play buttons render visually but are inert (Wave 2 owns audio).
class SurahView extends ConsumerStatefulWidget {
  const SurahView({super.key, required this.id});

  final int id;

  @override
  ConsumerState<SurahView> createState() => _SurahViewState();
}

class _SurahViewState extends ConsumerState<SurahView> {
  late final ScrollController _scroll;
  final _titleOpacity = ValueNotifier<double>(0);

  /// Scroll window (px) over which the app-bar title fades 0 → 1.
  static const _fadeStart = 40.0;
  static const _fadeRange = 80.0;

  @override
  void initState() {
    super.initState();
    _scroll = ScrollController()..addListener(_onScroll);
  }

  void _onScroll() {
    if (!_scroll.hasClients) return;
    _titleOpacity.value = ((_scroll.offset - _fadeStart) / _fadeRange).clamp(
      0.0,
      1.0,
    );
  }

  @override
  void dispose() {
    _scroll
      ..removeListener(_onScroll)
      ..dispose();
    _titleOpacity.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final id = widget.id;
    if (id < 1 || id > 114) {
      WidgetsBinding.instance.addPostFrameCallback((_) => context.go('/quran'));
      return const SizedBox.shrink();
    }
    final async = ref.watch(surahDetailProvider(id));
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      body: async.when(
        data: (surah) => CustomScrollView(
          controller: _scroll,
          slivers: [
            SliverAppBar(
              pinned: true,
              centerTitle: true,
              backgroundColor: scheme.surface,
              surfaceTintColor: Colors.transparent,
              scrolledUnderElevation: 0,
              elevation: 0,
              leading: IconButton(
                icon: const Icon(FLucideIcons.chevronLeft),
                onPressed: () => context.pop(),
              ),
              title: ValueListenableBuilder<double>(
                valueListenable: _titleOpacity,
                builder: (_, opacity, child) =>
                    Opacity(opacity: opacity, child: child),
                child: ThemedText(surah.namaLatin, variant: TextVariant.title),
              ),
              actions: [
                IconButton(
                  icon: const Icon(FLucideIcons.settings),
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
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.md,
        AppSpacing.md + AppSpacing.xs,
        AppSpacing.md,
        AppSpacing.md,
      ),
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
          const SizedBox(height: AppSpacing.xs),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 64),
            child: ThemedText(
              '$arti • $jumlahAyat Ayah',
              variant: TextVariant.caption,
              color: scheme.onSurfaceVariant,
              align: TextAlign.center,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          SvgPicture.asset(
            bright ? 'assets/svg/basmalah.svg' : 'assets/svg/basmalah_dark.svg',
            width: MediaQuery.sizeOf(context).width * 0.55,
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
          // Full-width RTL box: short (single-line) verses otherwise shrink
          // to intrinsic width and sit against the Column's left edge.
          SizedBox(
            width: double.infinity,
            child: Directionality(
              textDirection: TextDirection.rtl,
              child: ArabicText(arab, align: TextAlign.right),
            ),
          ),
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
                // RN parity: filled primary glyph when saved.
                child: Icon(
                  saved ? Icons.bookmark : FLucideIcons.bookmark,
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
