import 'dart:math';

/// Pure port of `qibla/utils/angle-utils.ts` (worklet markers dropped).
double normalizeAngle(double angle) => ((angle % 360) + 360) % 360;

/// Shortest signed rotation from [from] to [to], in [-180, 180].
double shortestRotation(double from, double to) {
  final diff = normalizeAngle(to - from);
  return diff > 180 ? diff - 360 : diff;
}

double radianToDegree(double rad) => rad * 180 / pi;

double degreeToRadian(double deg) => deg * pi / 180;
