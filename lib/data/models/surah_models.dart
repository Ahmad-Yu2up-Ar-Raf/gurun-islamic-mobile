import 'dart:convert';

/// 1:1 port of `SuraType` / `Surah` / `Ayah` (+ prev/next links).
/// `audioFull` / per-ayah `audio` maps are intentionally skipped (Wave 2).
class SurahSummary {
  const SurahSummary({
    required this.nomor,
    required this.nama,
    required this.namaLatin,
    required this.jumlahAyat,
    required this.tempatTurun,
    required this.arti,
    required this.deskripsi,
  });

  factory SurahSummary.fromJson(Map<String, dynamic> json) => SurahSummary(
    nomor: (json['nomor'] as num).toInt(),
    nama: json['nama'] as String? ?? '',
    namaLatin: json['namaLatin'] as String? ?? '',
    jumlahAyat: (json['jumlahAyat'] as num?)?.toInt() ?? 0,
    tempatTurun: json['tempatTurun'] as String? ?? '',
    arti: json['arti'] as String? ?? '',
    deskripsi: json['deskripsi'] as String? ?? '',
  );

  final int nomor;
  final String nama;
  final String namaLatin;
  final int jumlahAyat;
  final String tempatTurun;
  final String arti;
  final String deskripsi;
}

class Ayah {
  const Ayah({
    required this.nomorAyat,
    required this.teksArab,
    required this.teksLatin,
    required this.teksIndonesia,
  });

  factory Ayah.fromJson(Map<String, dynamic> json) => Ayah(
    nomorAyat: (json['nomorAyat'] as num).toInt(),
    teksArab: json['teksArab'] as String? ?? '',
    teksLatin: json['teksLatin'] as String? ?? '',
    teksIndonesia: json['teksIndonesia'] as String? ?? '',
  );

  final int nomorAyat;
  final String teksArab;
  final String teksLatin;
  final String teksIndonesia;
}

class SurahLink {
  const SurahLink({required this.nomor, required this.namaLatin});

  /// The API returns `false` (not an object) for missing neighbours
  /// (surah 1 has no previous, surah 114 has no next).
  factory SurahLink.fromJson(Object? json) {
    final m = json is Map<String, dynamic> ? json : null;
    return SurahLink(
      nomor: (m?['nomor'] as num?)?.toInt() ?? 0,
      namaLatin: m?['namaLatin'] as String? ?? '',
    );
  }

  final int nomor;
  final String namaLatin;
}

class SurahDetail extends SurahSummary {
  const SurahDetail({
    required super.nomor,
    required super.nama,
    required super.namaLatin,
    required super.jumlahAyat,
    required super.tempatTurun,
    required super.arti,
    required super.deskripsi,
    required this.ayat,
    required this.sebelumnya,
    required this.selanjutnya,
  });

  factory SurahDetail.fromJson(Map<String, dynamic> json) => SurahDetail(
    nomor: (json['nomor'] as num).toInt(),
    nama: json['nama'] as String? ?? '',
    namaLatin: json['namaLatin'] as String? ?? '',
    jumlahAyat: (json['jumlahAyat'] as num?)?.toInt() ?? 0,
    tempatTurun: json['tempatTurun'] as String? ?? '',
    arti: json['arti'] as String? ?? '',
    deskripsi: json['deskripsi'] as String? ?? '',
    ayat: ((json['ayat'] as List?) ?? const [])
        .map((e) => Ayah.fromJson(e as Map<String, dynamic>))
        .toList(),
    sebelumnya: SurahLink.fromJson(json['suratSebelumnya']),
    selanjutnya: SurahLink.fromJson(json['suratSelanjutnya']),
  );

  final List<Ayah> ayat;
  final SurahLink sebelumnya;
  final SurahLink selanjutnya;
}

List<SurahSummary> parseQuranList(String raw) {
  final decoded = jsonDecode(raw) as Map<String, dynamic>;
  final data = decoded['data'] as List? ?? const [];
  return data
      .map((e) => SurahSummary.fromJson(e as Map<String, dynamic>))
      .toList();
}

SurahDetail parseSurahDetail(String raw) {
  final decoded = jsonDecode(raw) as Map<String, dynamic>;
  return SurahDetail.fromJson(decoded['data'] as Map<String, dynamic>);
}
