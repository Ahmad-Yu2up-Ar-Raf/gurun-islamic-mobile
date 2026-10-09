import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:forui/forui.dart';
import 'package:go_router/go_router.dart';

import 'gurun_forui_theme.dart';
import 'providers.dart';
import 'theme.dart';
import '../ui/core/app_scaffold.dart';
import '../ui/features/asmaul_husna/views/asmaul_husna_view.dart';
import '../ui/features/doa/views/doa_view.dart';
import '../ui/features/dzikir/views/dzikir_view.dart';
import '../ui/features/hadist/views/hadist_view.dart';
import '../ui/features/home/views/home_view.dart';
import '../ui/features/qibla/views/qibla_view.dart';
import '../ui/features/quran/views/quran_view.dart';
import '../ui/features/settings/views/settings_view.dart';
import '../ui/features/surah/views/surah_view.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';

/// 4-tab shell (Home/Quran/Qibla/Settings) + drawer destinations
/// (Doa/Dzikir/Hadist/Asmaul Husna) + `/quran/:id`. No `/player` (Wave 2).
GoRouter buildRouter() => GoRouter(
  initialLocation: '/home',
  errorBuilder: (context, state) => Scaffold(
    appBar: AppBar(),
    body: Center(child: Text(state.error.toString())),
  ),
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) =>
          ScaffoldWithNavBar(navigationShell: navigationShell),
      branches: [
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/home',
              builder: (context, state) => const HomeView(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/quran',
              builder: (context, state) => const QuranView(),
              routes: [
                GoRoute(
                  path: ':id',
                  builder: (context, state) => SurahView(
                    id: int.tryParse(state.pathParameters['id'] ?? '') ?? 0,
                  ),
                ),
              ],
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/qibla',
              builder: (context, state) => const QiblaView(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/settings',
              builder: (context, state) => const SettingsView(),
            ),
          ],
        ),
      ],
    ),
    GoRoute(path: '/doa', builder: (context, state) => const DoaView()),
    GoRoute(path: '/dzikir', builder: (context, state) => const DzikirView()),
    GoRoute(path: '/hadist', builder: (context, state) => const HadistView()),
    GoRoute(
      path: '/asmaul-husna',
      builder: (context, state) => const AsmaulHusnaView(),
    ),
  ],
);

/// Shell scaffold. The bottom bar hides while the drawer (sheet menu) is
/// open so focus stays on the menu (1:1 with the RN drawer overlay).
class ScaffoldWithNavBar extends StatefulWidget {
  const ScaffoldWithNavBar({super.key, required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  @override
  State<ScaffoldWithNavBar> createState() => _ScaffoldWithNavBarState();
}

class _ScaffoldWithNavBarState extends State<ScaffoldWithNavBar> {
  var _drawerOpen = false;

  void _goBranch(int index) {
    widget.navigationShell.goBranch(
      index,
      initialLocation: index == widget.navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    Widget tabIcon(String asset, bool selected) => SvgPicture.asset(
      asset,
      width: 24,
      height: 24,
      colorFilter: ColorFilter.mode(
        selected ? scheme.secondary : scheme.onSurfaceVariant,
        BlendMode.srcIn,
      ),
    );
    final index = widget.navigationShell.currentIndex;
    return Scaffold(
      key: shellScaffoldKey,
      drawer: const AppDrawer(),
      onDrawerChanged: (open) => setState(() => _drawerOpen = open),
      body: widget.navigationShell,
      bottomNavigationBar: Opacity(
        opacity: _drawerOpen ? 0.35 : 1,
        child: IgnorePointer(
          ignoring: _drawerOpen,
          child: NavigationBar(
            selectedIndex: index,
            onDestinationSelected: _goBranch,
            height: 70,
            elevation: 3,
            destinations: [
              NavigationDestination(
                icon: tabIcon('assets/svg/tab_home.svg', false),
                selectedIcon: tabIcon('assets/svg/tab_home.svg', true),
                label: 'Home',
              ),
              NavigationDestination(
                icon: tabIcon('assets/svg/tab_quran.svg', false),
                selectedIcon: tabIcon('assets/svg/tab_quran.svg', true),
                label: 'Quran',
              ),
              NavigationDestination(
                icon: tabIcon('assets/svg/tab_kabbah.svg', false),
                selectedIcon: tabIcon('assets/svg/tab_kabbah.svg', true),
                label: 'Qibla',
              ),
              NavigationDestination(
                icon: tabIcon('assets/svg/tab_settings.svg', false),
                selectedIcon: tabIcon('assets/svg/tab_settings.svg', true),
                label: 'Settings',
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Root widget: theme + router binding (mirrors RN `Provider`).
class GurunApp extends ConsumerWidget {
  const GurunApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    return MaterialApp.router(
      title: 'Gurun',
      supportedLocales: FLocalizations.supportedLocales,
      localizationsDelegates: const [...FLocalizations.localizationsDelegates],
      theme: buildAppTheme(Brightness.light),
      darkTheme: buildAppTheme(Brightness.dark),
      themeMode: themeMode,
      builder: (context, child) => FTheme(
        data: Theme.brightnessOf(context) == Brightness.light
            ? gurunLightTheme
            : gurunDarkTheme,
        child: FToaster(child: FTooltipGroup(child: child!)),
      ),
      routerConfig: buildRouter(),
    );
  }
}
