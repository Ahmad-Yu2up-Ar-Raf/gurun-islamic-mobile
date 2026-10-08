import 'package:flutter/material.dart';

import '../../app/app_colors.dart';

/// Horizontal multi-select filter carousel (Dzikir `Semua/Pagi/Shalat/Sore`).
class FilterCarousel extends StatelessWidget {
  const FilterCarousel({
    super.key,
    required this.options,
    required this.selected,
    required this.onChanged,
  });

  final List<FilterOption> options;
  final Set<String> selected;
  final void Function(Set<String> next) onChanged;

  void _tap(String value) {
    final next = Set<String>.of(selected);
    if (value == '__all') {
      next.clear();
    } else if (next.contains(value)) {
      next.remove(value);
    } else {
      next.add(value);
    }
    onChanged(next);
  }

  @override
  Widget build(BuildContext context) {
    final allActive = selected.isEmpty;
    return SizedBox(
      width: double.infinity,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Row(
          children: [
            _Chip(
              label: 'Semua',
              active: allActive,
              showClear: false,
              onTap: () => _tap('__all'),
            ),
            for (final option in options)
              _Chip(
                label: option.label,
                active: selected.contains(option.value),
                showClear: true,
                onTap: () => _tap(option.value),
              ),
          ],
        ),
      ),
    );
  }
}

class FilterOption {
  const FilterOption({required this.label, required this.value});
  final String label;
  final String value;
}

class _Chip extends StatelessWidget {
  const _Chip({
    required this.label,
    required this.active,
    required this.showClear,
    required this.onTap,
  });

  final String label;
  final bool active;
  final bool showClear;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.sm),
      child: ChoiceChip(
        label: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (active && showClear) ...[
              Icon(Icons.cancel, size: 15, color: scheme.onPrimary),
              const SizedBox(width: 4),
            ],
            Text(label),
          ],
        ),
        selected: active,
        onSelected: (_) => onTap(),
        showCheckmark: false,
        selectedColor: scheme.primary,
        backgroundColor: Colors.transparent,
        side: BorderSide(color: active ? scheme.primary : scheme.outline),
        labelStyle: TextStyle(
          fontFamily: 'Poppins',
          fontSize: 12,
          fontWeight: active ? FontWeight.w600 : FontWeight.w500,
          color: active ? scheme.onPrimary : scheme.onSurfaceVariant,
        ),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
        shape: const StadiumBorder(),
      ),
    );
  }
}
