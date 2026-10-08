import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../app/app_colors.dart';
import '../../../../app/providers.dart';
import '../../../core/app_scaffold.dart';
import '../../../core/themed_text.dart';

/// Profile settings: theme toggle + static rows (1:1 with MenuCard).
class SettingsView extends ConsumerWidget {
  const SettingsView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final dark =
        themeMode == ThemeMode.dark ||
        (themeMode == ThemeMode.system &&
            MediaQuery.platformBrightnessOf(context) == Brightness.dark);
    return AppScaffold(
      title: 'Profile',
      leading: const BackButton(),
      edgePadding: 0,
      body: ListView(
        padding: const EdgeInsets.only(top: 44, bottom: 100),
        children: [
          _MenuRow(
            icon: Icons.settings_outlined,
            label: 'Settings',
            onTap: () {},
          ),
          _MenuRow(
            icon: Icons.dark_mode_outlined,
            label: 'Dark Mode',
            trailing: Switch(
              value: dark,
              onChanged: (value) =>
                  ref.read(themeModeProvider.notifier).toggleDark(value),
            ),
            onTap: () => ref.read(themeModeProvider.notifier).toggleDark(!dark),
          ),
          _MenuRow(
            icon: Icons.notifications_outlined,
            label: 'Mode liburan',
            onTap: () {},
          ),
        ],
      ),
    );
  }
}

class _MenuRow extends StatelessWidget {
  const _MenuRow({
    required this.icon,
    required this.label,
    this.trailing,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final Widget? trailing;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadius.lg),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: scheme.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(AppRadius.lg),
                  ),
                  child: Icon(icon, size: 21, color: scheme.primary),
                ),
                const SizedBox(width: 12),
                ThemedText(label, variant: TextVariant.body),
              ],
            ),
            trailing ??
                Icon(
                  Icons.chevron_right,
                  size: 18,
                  color: scheme.onSurfaceVariant,
                ),
          ],
        ),
      ),
    );
  }
}
