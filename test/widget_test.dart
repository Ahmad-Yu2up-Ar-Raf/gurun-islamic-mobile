// Wave 1 smoke test: the app shell builds (tabs + drawer destinations).
import 'package:flutter_test/flutter_test.dart';

import 'package:gurun_flutter/main.dart';

void main() {
  testWidgets('App boots to the home tab', (WidgetTester tester) async {
    await tester.pumpWidget(bootstrapAppForTest());
    await tester.pump();
    expect(find.text('Gurun'), findsWidgets);
  });
}
