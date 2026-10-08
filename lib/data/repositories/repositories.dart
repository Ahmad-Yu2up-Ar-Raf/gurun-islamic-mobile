import '../models/content_models.dart';
import '../models/prayer_models.dart';
import '../models/surah_models.dart';
import '../services/api_clients.dart';

/// TTL cache entry: replicates TanStack `staleTime` semantics in-session.
/// (Hive persistence for 24h Quran GC is Wave 3 hardening.)
class _Entry<T> {
  _Entry(this.value, this.at);
  final T value;
  final DateTime at;
}

abstract class TtlCache {
  final _store = <String, _Entry<Object>>{};

  T? fresh<T>(String key, Duration stale) {
    final entry = _store[key];
    if (entry == null) return null;
    if (DateTime.now().difference(entry.at) > stale) return null;
    return entry.value as T;
  }

  void put(String key, Object value) =>
      _store[key] = _Entry(value, DateTime.now());
}

class QuranRepository extends TtlCache {
  static const quranStale = Duration(minutes: 30);
  static const surahStale = Duration(minutes: 30);

  Future<List<SurahSummary>> fetchQuran() async {
    final hit = fresh<List<SurahSummary>>('quran', quranStale);
    if (hit != null) return hit;
    final list = await getAndParse(
      ApiClients.equran,
      'v2/surat',
      parseQuranList,
    );
    put('quran', list);
    return list;
  }

  Future<SurahDetail> fetchSurah(int id) async {
    final hit = fresh<SurahDetail>('surah/$id', surahStale);
    if (hit != null) return hit;
    final detail = await getAndParse(
      ApiClients.equran,
      'v2/surat/$id',
      parseSurahDetail,
    );
    put('surah/$id', detail);
    return detail;
  }
}

class ContentRepository extends TtlCache {
  static const contentStale = Duration(minutes: 5);

  Future<List<DoaItem>> fetchDoa() async {
    final hit = fresh<List<DoaItem>>('doa', contentStale);
    if (hit != null) return hit;
    final list = await getAndParse(ApiClients.doa, 'doa', parseDoaList);
    put('doa', list);
    return list;
  }

  Future<List<DzikirItem>> fetchDzikir() async {
    final hit = fresh<List<DzikirItem>>('dzikir', contentStale);
    if (hit != null) return hit;
    final list = await getAndParse(
      ApiClients.muslim,
      'dzikir',
      parseDzikirList,
    );
    put('dzikir', list);
    return list;
  }

  Future<List<HadistItem>> fetchHadist() async {
    final hit = fresh<List<HadistItem>>('hadist', contentStale);
    if (hit != null) return hit;
    final list = await getAndParse(
      ApiClients.muslim,
      'hadits',
      parseHadistList,
    );
    put('hadist', list);
    return list;
  }

  Future<List<AsmaulHusnaItem>> fetchAsmaulHusna() async {
    final hit = fresh<List<AsmaulHusnaItem>>('asmaul', contentStale);
    if (hit != null) return hit;
    final list = await getAndParse(
      ApiClients.asmaul,
      'all',
      parseAsmaulHusnaList,
    );
    put('asmaul', list);
    return list;
  }
}

class PrayerRepository extends TtlCache {
  static const prayerStale = Duration(hours: 1);

  Future<MonthSchedule> fetchSchedule(String provinsi, String kabkota) async {
    final key = 'shalat/$provinsi/$kabkota';
    final hit = fresh<MonthSchedule>(key, prayerStale);
    if (hit != null) return hit;
    final schedule = await getAndParse(
      ApiClients.equran,
      'v2/shalat',
      parseMonthSchedule,
      body: {'provinsi': provinsi, 'kabkota': kabkota},
      post: true,
    );
    put(key, schedule);
    return schedule;
  }
}
