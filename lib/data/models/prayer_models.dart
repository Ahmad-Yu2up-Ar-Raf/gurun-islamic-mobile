import 'dart:convert';

/// 1:1 port of the prayer-schedule payloads (`POST v2/shalat`,
/// `GET v2/shalat/provinsi`, `POST v2/shalat/kabkota`).
class DailyJadwal {
  const DailyJadwal({
    required this.tanggal,
    required this.tanggalLengkap,
    required this.imsak,
    required this.subuh,
    required this.dzuhur,
    required this.ashar,
    required this.maghrib,
    required this.isya,
  });

  factory DailyJadwal.fromJson(Map<String, dynamic> json) => DailyJadwal(
    tanggal: (json['tanggal'] as num?)?.toInt() ?? 0,
    tanggalLengkap: json['tanggal_lengkap'] as String? ?? '',
    imsak: json['imsak'] as String? ?? '',
    subuh: json['subuh'] as String? ?? '',
    dzuhur: json['dzuhur'] as String? ?? '',
    ashar: json['ashar'] as String? ?? '',
    maghrib: json['maghrib'] as String? ?? '',
    isya: json['isya'] as String? ?? '',
  );

  final int tanggal;
  final String tanggalLengkap;
  final String imsak;
  final String subuh;
  final String dzuhur;
  final String ashar;
  final String maghrib;
  final String isya;
}

class MonthSchedule {
  const MonthSchedule({
    required this.provinsi,
    required this.kabkota,
    required this.jadwal,
  });

  factory MonthSchedule.fromJson(Map<String, dynamic> json) {
    final data = json['data'] as Map<String, dynamic>? ?? const {};
    return MonthSchedule(
      provinsi: data['provinsi'] as String? ?? '',
      kabkota: data['kabkota'] as String? ?? '',
      jadwal: ((data['jadwal'] as List?) ?? const [])
          .map((e) => DailyJadwal.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  final String provinsi;
  final String kabkota;
  final List<DailyJadwal> jadwal;
}

MonthSchedule parseMonthSchedule(String raw) =>
    MonthSchedule.fromJson(jsonDecode(raw) as Map<String, dynamic>);

List<String> parseProvinces(String raw) {
  final decoded = jsonDecode(raw) as Map<String, dynamic>;
  return ((decoded['data'] as List?) ?? const []).map((e) => '$e').toList();
}

List<String> parseCities(String raw) {
  final decoded = jsonDecode(raw) as Map<String, dynamic>;
  return ((decoded['data'] as List?) ?? const []).map((e) => '$e').toList();
}
