import 'package:geolocator/geolocator.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Persisted device-region state. Defaults mirror the RN store
/// (`Jawa Barat / Kota Bogor`) so first paint matches 1:1.
class DeviceRegion {
  const DeviceRegion({
    required this.province,
    required this.city,
    required this.latitude,
    required this.longitude,
  });

  final String province;
  final String city;
  final double latitude;
  final double longitude;
}

const defaultRegion = DeviceRegion(
  province: 'Jawa Barat',
  city: 'Kota Bogor',
  latitude: -6.595,
  longitude: 106.806,
);

class LocationRepository {
  static const _provinceKey = 'region.province';
  static const _cityKey = 'region.city';

  Future<DeviceRegion> load() async {
    final prefs = SharedPreferencesAsync();
    final province = await prefs.getString(_provinceKey);
    final city = await prefs.getString(_cityKey);
    return DeviceRegion(
      province: province ?? defaultRegion.province,
      city: city ?? defaultRegion.city,
      latitude: defaultRegion.latitude,
      longitude: defaultRegion.longitude,
    );
  }

  Future<void> save(String province, String city) async {
    final prefs = SharedPreferencesAsync();
    await prefs.setString(_provinceKey, province);
    await prefs.setString(_cityKey, city);
  }

  /// Best-effort GPS refresh; silent null when permission denied.
  Future<Position?> currentPosition() async {
    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    if (permission == LocationPermission.denied ||
        permission == LocationPermission.deniedForever) {
      return null;
    }
    return Geolocator.getCurrentPosition();
  }
}

/// Bookmark entry id format: `{surahNomor}:{nomorAyat}` (e.g. `2:255`).
class BookmarkRepository {
  static const _key = 'bookmarks.v1';

  Future<List<String>> load() async {
    final prefs = SharedPreferencesAsync();
    return (await prefs.getStringList(_key)) ?? const [];
  }

  Future<List<String>> toggle(List<String> current, String id) async {
    final next = List<String>.of(current);
    if (next.contains(id)) {
      next.remove(id);
    } else {
      next.add(id);
    }
    await SharedPreferencesAsync().setStringList(_key, next);
    return next;
  }
}
