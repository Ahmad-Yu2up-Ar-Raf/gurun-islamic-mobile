import 'package:flutter/material.dart';

import 'app/bootstrap.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(bootstrapApp());
}

/// Test entry point (avoids double-binding in `flutter test`).
Widget bootstrapAppForTest() => bootstrapApp();
