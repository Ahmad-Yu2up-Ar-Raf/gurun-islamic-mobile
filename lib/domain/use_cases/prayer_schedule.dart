import '../../data/models/prayer_models.dart';

/// Pure port of `home/utils/prayer-time.ts`.
const prayerOrder = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

const prayerLabels = {
  'subuh': 'Subuh',
  'dzuhur': 'Dzuhur',
  'ashar': 'Ashar',
  'maghrib': 'Maghrib',
  'isya': 'Isya',
};

String _pad(int n) => n.toString().padLeft(2, '0');

String formatDateId(DateTime now) {
  const months = [
    '',
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  return '${_pad(now.day)} ${months[now.month]} ${now.year}';
}

String formatClock(DateTime now) => '${_pad(now.hour)}:${_pad(now.minute)}';

String formatDuration(Duration d) {
  final total = d.inSeconds.clamp(0, 86399);
  return '${_pad(total ~/ 3600)}:${_pad((total % 3600) ~/ 60)}:${_pad(total % 60)}';
}

String _yyyymmdd(DateTime now) =>
    '${now.year}-${_pad(now.month)}-${_pad(now.day)}';

DailyJadwal? findTodayJadwal(List<DailyJadwal> jadwal, DateTime now) {
  final key = _yyyymmdd(now);
  for (final day in jadwal) {
    if (day.tanggalLengkap == key) return day;
  }
  return null;
}

String _timeOf(DailyJadwal day, String key) {
  switch (key) {
    case 'subuh':
      return day.subuh;
    case 'dzuhur':
      return day.dzuhur;
    case 'ashar':
      return day.ashar;
    case 'maghrib':
      return day.maghrib;
    case 'isya':
      return day.isya;
    default:
      return day.subuh;
  }
}

/// Parses `HH:mm` (tolerates trailing `:ss`); null when malformed so a
/// single bad API field can never red-screen the countdown.
DateTime? _at(DateTime now, String hhmm) {
  final parts = hhmm.split(':');
  if (parts.length < 2) return null;
  final hour = int.tryParse(parts[0]);
  final minute = int.tryParse(parts[1]);
  if (hour == null || minute == null) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return DateTime(now.year, now.month, now.day, hour, minute);
}

/// One row of the prayer carousel / countdown source.
class PrayerScheduleItem {
  const PrayerScheduleItem({
    required this.key,
    required this.label,
    required this.time,
    required this.status,
    required this.remaining,
  });

  final String key;
  final String label;
  final String time;
  final PrayerStatus status;
  final Duration remaining;
}

enum PrayerStatus { active, next, done, waiting }

/// Mirrors `buildTodayPrayerSchedule`: current = last time <= now,
/// next = current + 1. Malformed entries are skipped for ordering and
/// surface as `waiting` with zero remaining instead of throwing.
List<PrayerScheduleItem> buildTodaySchedule(DailyJadwal day, DateTime now) {
  final times = {for (final k in prayerOrder) k: _at(now, _timeOf(day, k))};
  var currentKey = '';
  for (final k in prayerOrder) {
    final t = times[k];
    if (t != null && !t.isAfter(now)) currentKey = k;
  }
  final currentIndex = prayerOrder.indexOf(currentKey);
  final nextIndex = currentKey.isEmpty ? 0 : currentIndex + 1;

  bool orderable(String key) => times[key] != null;

  final items = <PrayerScheduleItem>[];
  for (var i = 0; i < prayerOrder.length; i++) {
    final key = prayerOrder[i];
    final PrayerStatus status;
    final Duration remaining;
    if (!orderable(key)) {
      status = PrayerStatus.waiting;
      remaining = Duration.zero;
    } else if (i < nextIndex || (currentKey.isNotEmpty && i <= currentIndex)) {
      status = i == currentIndex ? PrayerStatus.active : PrayerStatus.done;
      remaining = Duration.zero;
    } else if (i == nextIndex || (currentKey.isEmpty && i == 0)) {
      status = PrayerStatus.next;
      remaining = times[key]!.difference(now);
    } else {
      status = PrayerStatus.waiting;
      remaining = times[key]!.difference(now);
    }
    items.add(
      PrayerScheduleItem(
        key: key,
        label: prayerLabels[key]!,
        time: _timeOf(day, key),
        status: status,
        remaining: remaining.isNegative ? Duration.zero : remaining,
      ),
    );
  }
  return items;
}

/// Countdown target: next prayer time. Post-Isya (no `next` item) targets
/// tomorrow's Subuh when [tomorrow] is given, else end of day (legacy).
/// Items with malformed times are skipped, never thrown on.
({String label, DateTime target}) nextPrayerTarget(
  List<PrayerScheduleItem> items,
  DateTime now, {
  DailyJadwal? tomorrow,
}) {
  for (final item in items) {
    if (item.status == PrayerStatus.next) {
      final at = _at(now, item.time);
      if (at == null) continue;
      return (label: item.label, target: at);
    }
  }
  final tomorrowSubuh = tomorrow == null
      ? null
      : _at(
          DateTime(now.year, now.month, now.day).add(const Duration(days: 1)),
          tomorrow.subuh,
        );
  if (tomorrowSubuh != null) {
    return (label: prayerLabels['subuh']!, target: tomorrowSubuh);
  }
  return (
    label: prayerLabels['subuh']!,
    target: DateTime(now.year, now.month, now.day, 23, 59, 59, 999),
  );
}
