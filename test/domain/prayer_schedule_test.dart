import 'package:flutter_test/flutter_test.dart';
import 'package:gurun_flutter/data/models/prayer_models.dart';
import 'package:gurun_flutter/domain/use_cases/prayer_schedule.dart';

DailyJadwal _day(
  String tanggalLengkap, {
  String subuh = '04:19',
  String dzuhur = '11:44',
  String ashar = '14:46',
  String maghrib = '17:54',
  String isya = '19:03',
}) => DailyJadwal(
  tanggal: 8,
  tanggalLengkap: tanggalLengkap,
  imsak: '04:09',
  subuh: subuh,
  dzuhur: dzuhur,
  ashar: ashar,
  maghrib: maghrib,
  isya: isya,
);

void main() {
  group('nextPrayerTarget post-Isya', () {
    test('targets tomorrow subuh after isya when tomorrow given', () {
      final now = DateTime(2026, 10, 8, 22);
      final items = buildTodaySchedule(_day('2026-10-08'), now);
      final target = nextPrayerTarget(
        items,
        now,
        tomorrow: _day('2026-10-09', subuh: '04:18'),
      );
      expect(target.label, 'Subuh');
      expect(target.target, DateTime(2026, 10, 9, 4, 18));
    });

    test('keeps end-of-day fallback without tomorrow info', () {
      final now = DateTime(2026, 10, 8, 22);
      final items = buildTodaySchedule(_day('2026-10-08'), now);
      final target = nextPrayerTarget(items, now);
      expect(target.target, DateTime(2026, 10, 8, 23, 59, 59, 999));
    });

    test('skips malformed time strings instead of throwing', () {
      final now = DateTime(2026, 10, 8, 12);
      final items = buildTodaySchedule(_day('2026-10-08', dzuhur: ''), now);
      expect(() => nextPrayerTarget(items, now), returnsNormally);
    });
  });

  group('buildTodaySchedule robustness', () {
    test('does not throw on empty time strings', () {
      final now = DateTime(2026, 10, 8, 12);
      final items = buildTodaySchedule(
        _day('2026-10-08', subuh: '', dzuhur: 'xx', ashar: '14:46'),
        now,
      );
      expect(items, hasLength(5));
    });

    test('midday still resolves ashar as next', () {
      final now = DateTime(2026, 10, 8, 12);
      final items = buildTodaySchedule(_day('2026-10-08'), now);
      final target = nextPrayerTarget(items, now);
      expect(target.label, 'Ashar');
      expect(target.target, DateTime(2026, 10, 8, 14, 46));
    });
  });
}
