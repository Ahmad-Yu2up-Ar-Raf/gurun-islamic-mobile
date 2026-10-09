import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../app/app_colors.dart';
import 'themed_text.dart';

/// Key of the shell scaffold that owns the sheet-menu drawer.
/// Screens open the menu through [openSheetMenu] (the drawer lives on the
/// shell so it can dim the bottom bar while open).
final GlobalKey<ScaffoldState> shellScaffoldKey = GlobalKey<ScaffoldState>();

/// Opens the sheet menu from any screen's leading button.
void openSheetMenu() => shellScaffoldKey.currentState?.openDrawer();

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
              child: ListView.separated(
                padding: EdgeInsets.zero,
                itemCount: _destinations.length,
                separatorBuilder: (_, _) => Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  height: 0.5,
                  color: Theme.of(context).colorScheme.outline
                      .withValues(alpha: 0.5),
                ),
                itemBuilder: (context, i) {
                  final (mark, label, route) = _destinations[i];
                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 4,
                    ),
                    leading: Text(mark, style: const TextStyle(fontSize: 20)),
                    title: ThemedText(
                      label,
                      variant: TextVariant.body,
                      weight: FontWeight.w500,
                    ),
                    onTap: () {
                      Navigator.of(context).pop();
                      context.go(route);
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
