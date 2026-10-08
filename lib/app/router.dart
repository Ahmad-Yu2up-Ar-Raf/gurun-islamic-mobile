import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'providers.dart';
import 'theme.dart';
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

class ScaffoldWithNavBar extends StatelessWidget {
  const ScaffoldWithNavBar({super.key, required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  void _goBranch(int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: _goBranch,
        height: 70,
        elevation: 3,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.menu_book_outlined),
            selectedIcon: Icon(Icons.menu_book),
            label: 'Quran',
          ),
          NavigationDestination(
            icon: Icon(Icons.explore_outlined),
            selectedIcon: Icon(Icons.explore),
            label: 'Qibla',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
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
      theme: buildAppTheme(Brightness.light),
      darkTheme: buildAppTheme(Brightness.dark),
      themeMode: themeMode,
      routerConfig: buildRouter(),
    );
  }
}
