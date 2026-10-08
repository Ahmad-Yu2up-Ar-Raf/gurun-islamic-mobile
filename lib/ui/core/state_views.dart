import 'package:flutter/material.dart';

import '../../app/app_colors.dart';
import 'themed_text.dart';

/// Loading / error / empty states shared by every data screen.
class LoadingState extends StatelessWidget {
  const LoadingState({super.key, this.message = 'Memuat data...'});

  final String message;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircularProgressIndicator(color: scheme.primary),
          const SizedBox(height: AppSpacing.md),
          ThemedText(
            message,
            variant: TextVariant.body,
            color: scheme.onSurfaceVariant,
            align: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class ErrorState extends StatelessWidget {
  const ErrorState({
    super.key,
    required this.title,
    this.message,
    required this.onRetry,
  });

  final String title;
  final String? message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ThemedText(
              title,
              variant: TextVariant.body,
              align: TextAlign.center,
            ),
            if (message != null) ...[
              const SizedBox(height: AppSpacing.sm),
              ThemedText(
                message!,
                variant: TextVariant.caption,
                color: scheme.error,
                align: TextAlign.center,
              ),
            ],
            const SizedBox(height: AppSpacing.md),
            AppButton(label: 'Coba lagi', onPressed: onRetry),
          ],
        ),
      ),
    );
  }
}

class EmptyState extends StatelessWidget {
  const EmptyState({super.key, required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.only(top: 240),
        child: ThemedText(
          message,
          variant: TextVariant.body,
          color: Theme.of(context).colorScheme.onSurfaceVariant,
          align: TextAlign.center,
        ),
      ),
    );
  }
}

/// Filled / ghost buttons with pressed + disabled + loading states.
class AppButton extends StatelessWidget {
  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.ghost = false,
    this.loading = false,
    this.expanded = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool ghost;
  final bool loading;
  final bool expanded;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final style = TextStyle(
      fontFamily: 'Poppins',
      fontWeight: FontWeight.w600,
      fontSize: 14,
      color: ghost ? scheme.onSurface : scheme.onPrimary,
    );
    final button = ghost
        ? OutlinedButton(
            onPressed: loading ? null : onPressed,
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: scheme.outline),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.lg),
              ),
            ),
            child: _Label(label: label, style: style, loading: loading),
          )
        : FilledButton(
            onPressed: loading ? null : onPressed,
            style: FilledButton.styleFrom(
              backgroundColor: scheme.primary,
              foregroundColor: scheme.onPrimary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppRadius.lg),
              ),
            ),
            child: _Label(label: label, style: style, loading: loading),
          );
    return expanded ? SizedBox(width: double.infinity, child: button) : button;
  }
}

class _Label extends StatelessWidget {
  const _Label({
    required this.label,
    required this.style,
    required this.loading,
  });

  final String label;
  final TextStyle style;
  final bool loading;

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return SizedBox(
        width: 18,
        height: 18,
        child: CircularProgressIndicator(strokeWidth: 2, color: style.color),
      );
    }
    return Text(label, style: style);
  }
}

/// Small `bg-primary/10` pill (ayat refs, dzikir badges).
class CountPill extends StatelessWidget {
  const CountPill({super.key, required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: 2,
      ),
      decoration: BoxDecoration(
        color: scheme.primary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(AppRadius.lg),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontFamily: 'Poppins',
          fontWeight: FontWeight.w600,
          fontSize: 13,
          color: scheme.onSurface,
        ),
      ),
    );
  }
}
