import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'providers.dart';
import 'router.dart';

/// Pre-warm gate: restores theme/region/bookmarks before first frame,
/// mirroring RN `AppBootstrap` (fonts → location → splash hide).
Future<void> bootstrap(ProviderContainer container) async {
  container.read(themeModeProvider.notifier);
  container.read(regionProvider.notifier);
  container.read(bookmarkProvider.notifier);
  await Future<void>.delayed(Duration.zero);
}

Widget bootstrapApp() => const ProviderScope(child: GurunApp());
