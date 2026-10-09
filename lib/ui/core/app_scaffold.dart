import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../app/app_colors.dart';
import 'themed_text.dart';

/// True while any screen's drawer (sheet menu) is open. The shell listens
/// to hide the bottom bar so focus stays on the menu (RN drawer behavior).
final ValueNotifier<bool> sheetMenuOpen = ValueNotifier<bool>(false);

/// Screen wrapper: safe area + scroll column with screen-edge padding.
/// Mirrors the RN `Wrapper` (`px-8` outer, feature `gap-3`).
class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    required this.title,
    required this.body,
    this.centerTitle = true,
    this.leading,
    this.actions,
    this.belowHeader,
    this.edgePadding = AppSpacing.md,
  });

  final String title;
  final Widget body;
  final bool centerTitle;
  final Widget? leading;
  final List<Widget>? actions;
  final Widget? belowHeader;
  final double edgePadding;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TekoText(title, fontSize: 28),
        centerTitle: centerTitle,
        leading: leading,
        actions: actions,
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
      ),
      drawer: const AppDrawer(),
      onDrawerChanged: (open) => sheetMenuOpen.value = open,
      body: SafeArea(
        child: Column(
          children: [
            belowHeader ?? const SizedBox.shrink(),
            Expanded(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: edgePadding),
                child: body,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Drawer with Gurun branding + 8 destinations (mirrors RN `DRAWER_MENU`,
/// benchmark `sheet-menu.png`; RN marks are emoji).
class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  static const _destinations = [
    ('🏠', 'Home', '/home'),
    ('📖', 'Quran', '/quran'),
    ('🕌', 'Qibla', '/qibla'),
    ('🤲', 'Doa', '/doa'),
    ('📿', 'Dzikir', '/dzikir'),
    ('⭐', 'Asmaul Husna', '/asmaul-husna'),
    ('📚', 'Hadist', '/hadist'),
    ('⚙️', 'Settings', '/settings'),
  ];

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Drawer(
      width: 280,
      backgroundColor: scheme.surface,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 4),
              child: Text(
                'Gurun',
                style: TextStyle(
                  fontFamily: 'Schluber',
                  fontSize: 28,
                  color: scheme.onSurface,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ThemedText(
                'Islamic Companion App',
                variant: TextVariant.caption,
                color: scheme.onSurfaceVariant,
              ),
            ),
            Container(
              margin: const EdgeInsets.fromLTRB(16, 12, 16, 4),
              height: 0.5,
              color: scheme.onSurfaceVariant.withValues(alpha: 0.2),
            ),
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  for (final (mark, label, route) in _destinations)
                    ListTile(
                      leading: Text(mark, style: const TextStyle(fontSize: 20)),
                      title: ThemedText(label, variant: TextVariant.body),
                      onTap: () {
                        Navigator.of(context).pop();
                        context.go(route);
                      },
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
