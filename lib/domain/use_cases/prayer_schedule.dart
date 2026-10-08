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

DateTime _at(DateTime now, String hhmm) {
  final parts = hhmm.split(':');
  return DateTime(
    now.year,
    now.month,
    now.day,
    int.parse(parts[0]),
    int.parse(parts[1]),
  );
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
/// next = current + 1, else post-Isya counts down to midnight.
List<PrayerScheduleItem> buildTodaySchedule(DailyJadwal day, DateTime now) {
  final times = {for (final k in prayerOrder) k: _at(now, _timeOf(day, k))};
  var currentKey = '';
  for (final k in prayerOrder) {
    if (!times[k]!.isAfter(now)) currentKey = k;
  }
  final currentIndex = prayerOrder.indexOf(currentKey);
  final nextIndex = currentKey.isEmpty ? 0 : currentIndex + 1;

  final items = <PrayerScheduleItem>[];
  for (var i = 0; i < prayerOrder.length; i++) {
    final key = prayerOrder[i];
    final PrayerStatus status;
    final Duration remaining;
    if (i < nextIndex || (currentKey.isNotEmpty && i <= currentIndex)) {
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

/// Countdown target: next prayer time, else end of day.
({String label, DateTime target}) nextPrayerTarget(
  List<PrayerScheduleItem> items,
  DateTime now,
) {
  for (final item in items) {
    if (item.status == PrayerStatus.next) {
      final parts = item.time.split(':');
      return (
        label: item.label,
        target: DateTime(
          now.year,
          now.month,
          now.day,
          int.parse(parts[0]),
          int.parse(parts[1]),
        ),
      );
    }
  }
  return (
    label: prayerLabels['subuh']!,
    target: DateTime(now.year, now.month, now.day, 23, 59, 59, 999),
  );
}
