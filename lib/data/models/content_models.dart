import 'dart:convert';

/// 1:1 ports of `DOAResponse`, dzikir `Datum`, hadist `Datum`,
/// asmaul-husna `Datum` (+ top-level isolate parsers).
class DoaItem {
  const DoaItem({
    required this.id,
    required this.judul,
    required this.latin,
    required this.arab,
    required this.terjemah,
  });

  factory DoaItem.fromJson(Map<String, dynamic> json) => DoaItem(
    id: (json['id'] as num).toInt(),
    judul: json['judul'] as String? ?? '',
    latin: json['latin'] as String? ?? '',
    arab: json['arab'] as String? ?? '',
    terjemah: json['terjemah'] as String? ?? '',
  );

  final int id;
  final String judul;
  final String latin;
  final String arab;
  final String terjemah;
}

class DzikirItem {
  const DzikirItem({
    required this.type,
    required this.arab,
    required this.indo,
    required this.ulang,
  });

  factory DzikirItem.fromJson(Map<String, dynamic> json) => DzikirItem(
    type: json['type'] as String? ?? '',
    arab: json['arab'] as String? ?? '',
    indo: json['indo'] as String? ?? '',
    ulang: json['ulang'] as String? ?? '',
  );

  final String type;
  final String arab;
  final String indo;
  final String ulang;
}

class HadistItem {
  const HadistItem({
    required this.no,
    required this.judul,
    required this.arab,
    required this.indo,
  });

  factory HadistItem.fromJson(Map<String, dynamic> json) => HadistItem(
    no: '${json['no'] ?? ''}',
    judul: json['judul'] as String? ?? '',
    arab: json['arab'] as String? ?? '',
    indo: json['indo'] as String? ?? '',
  );

  final String no;
  final String judul;
  final String arab;
  final String indo;
}

class AsmaulHusnaItem {
  const AsmaulHusnaItem({
    required this.urutan,
    required this.latin,
    required this.arab,
    required this.arti,
  });

  factory AsmaulHusnaItem.fromJson(Map<String, dynamic> json) =>
      AsmaulHusnaItem(
        urutan: (json['urutan'] as num).toInt(),
        latin: json['latin'] as String? ?? '',
        arab: json['arab'] as String? ?? '',
        arti: json['arti'] as String? ?? '',
      );

  final int urutan;
  final String latin;
  final String arab;
  final String arti;
}

List<DoaItem> parseDoaList(String raw) {
  final decoded = jsonDecode(raw) as List? ?? const [];
  return decoded
      .map((e) => DoaItem.fromJson(e as Map<String, dynamic>))
      .toList();
}

List<DzikirItem> parseDzikirList(String raw) {
  final decoded = jsonDecode(raw) as Map<String, dynamic>;
  final data = decoded['data'] as List? ?? const [];
  return data
      .map((e) => DzikirItem.fromJson(e as Map<String, dynamic>))
      .toList();
}

List<HadistItem> parseHadistList(String raw) {
  final decoded = jsonDecode(raw) as Map<String, dynamic>;
  final data = decoded['data'] as List? ?? const [];
  return data
      .map((e) => HadistItem.fromJson(e as Map<String, dynamic>))
      .toList();
}

List<AsmaulHusnaItem> parseAsmaulHusnaList(String raw) {
  final decoded = jsonDecode(raw) as Map<String, dynamic>;
  final data = decoded['data'] as List? ?? const [];
  return data
      .map((e) => AsmaulHusnaItem.fromJson(e as Map<String, dynamic>))
      .toList();
}
