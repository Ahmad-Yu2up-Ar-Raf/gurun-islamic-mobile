import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../data/models/content_models.dart';
import '../data/models/surah_models.dart';
import '../data/repositories/device_repositories.dart';
import '../data/repositories/repositories.dart';
import '../domain/use_cases/prayer_schedule.dart';

// --- Client state (Zustand equivalents) ---

class ThemeModeNotifier extends Notifier<ThemeMode> {
  static const _key = 'ui.themeMode';

  @override
  ThemeMode build() {
    _restore();
    return ThemeMode.system;
  }

  Future<void> _restore() async {
    final raw = await SharedPreferencesAsync().getString(_key);
    if (raw == null) return;
    state = ThemeMode.values.asNameMap()[raw] ?? ThemeMode.system;
  }

  Future<void> toggleDark(bool dark) async {
    state = dark ? ThemeMode.dark : ThemeMode.light;
    await SharedPreferencesAsync().setString(_key, state.name);
  }
}

final themeModeProvider = NotifierProvider<ThemeModeNotifier, ThemeMode>(
  ThemeModeNotifier.new,
);

class RegionNotifier extends Notifier<DeviceRegion> {
  @override
  DeviceRegion build() {
    _restore();
    return defaultRegion;
  }

  Future<void> _restore() async {
    state = await ref.watch(locationRepositoryProvider).load();
  }

  Future<void> refreshFromGps() async {
    final pos = await ref.read(locationRepositoryProvider).currentPosition();
    if (pos == null) return;
    state = DeviceRegion(
      province: state.province,
      city: state.city,
      latitude: pos.latitude,
      longitude: pos.longitude,
    );
  }
}

final regionProvider = NotifierProvider<RegionNotifier, DeviceRegion>(
  RegionNotifier.new,
);

class BookmarkNotifier extends Notifier<List<String>> {
  @override
  List<String> build() {
    _restore();
    return const [];
  }

  Future<void> _restore() async {
    state = await ref.watch(bookmarkRepositoryProvider).load();
  }

  Future<void> toggle(String id) async {
    state = await ref.read(bookmarkRepositoryProvider).toggle(state, id);
  }
}

final bookmarkProvider = NotifierProvider<BookmarkNotifier, List<String>>(
  BookmarkNotifier.new,
);

/// Dzikir type filter; empty = all (mirrors `selectedTypes: Type[]`).
class DzikirFilterNotifier extends Notifier<Set<String>> {
  @override
  Set<String> build() => const {};

  void toggle(String type) {
    final next = Set<String>.of(state);
    if (next.contains(type)) {
      next.remove(type);
    } else {
      next.add(type);
    }
    state = next;
  }

  // ignore: use_setters_to_change_properties
  void set(Set<String> next) => state = next;

  void clear() => state = const {};
}

final dzikirFilterProvider =
    NotifierProvider<DzikirFilterNotifier, Set<String>>(
      DzikirFilterNotifier.new,
    );

// --- Repositories ---

final quranRepositoryProvider = Provider<QuranRepository>(
  (ref) => QuranRepository(),
);
final contentRepositoryProvider = Provider<ContentRepository>(
  (ref) => ContentRepository(),
);
final prayerRepositoryProvider = Provider<PrayerRepository>(
  (ref) => PrayerRepository(),
);
final locationRepositoryProvider = Provider<LocationRepository>(
  (ref) => LocationRepository(),
);
final bookmarkRepositoryProvider = Provider<BookmarkRepository>(
  (ref) => BookmarkRepository(),
);

// --- Server state (TanStack Query equivalents) ---

final quranListProvider = FutureProvider<List<SurahSummary>>((ref) async {
  final repo = ref.watch(quranRepositoryProvider);
  return repo.fetchQuran();
});

final surahDetailProvider = FutureProvider.family((ref, int id) async {
  final repo = ref.watch(quranRepositoryProvider);
  return repo.fetchSurah(id);
});

final doaListProvider = FutureProvider<List<DoaItem>>((ref) async {
  final repo = ref.watch(contentRepositoryProvider);
  return repo.fetchDoa();
});

final dzikirListProvider = FutureProvider<List<DzikirItem>>((ref) async {
  final repo = ref.watch(contentRepositoryProvider);
  final filter = ref.watch(dzikirFilterProvider);
  final all = await repo.fetchDzikir();
  if (filter.isEmpty) return all;
  return all.where((e) => filter.contains(e.type)).toList();
});

final hadistListProvider = FutureProvider<List<HadistItem>>((ref) async {
  final repo = ref.watch(contentRepositoryProvider);
  return repo.fetchHadist();
});

final asmaulHusnaListProvider = FutureProvider<List<AsmaulHusnaItem>>((
  ref,
) async {
  final repo = ref.watch(contentRepositoryProvider);
  return repo.fetchAsmaulHusna();
});

final todayScheduleProvider = FutureProvider<List<PrayerScheduleItem>>((
  ref,
) async {
  final region = ref.watch(regionProvider);
  final repo = ref.watch(prayerRepositoryProvider);
  final month = await repo.fetchSchedule(region.province, region.city);
  final today = findTodayJadwal(month.jadwal, DateTime.now());
  if (today == null) return const [];
  return buildTodaySchedule(today, DateTime.now());
});
