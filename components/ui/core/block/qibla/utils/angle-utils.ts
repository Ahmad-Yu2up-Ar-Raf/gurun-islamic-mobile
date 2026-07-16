/**
 * lib/angle-utils.ts
 *
 * Utility functions untuk angle calculations yang clean dan consistent.
 * Semua angle dalam derajat (0-360), bukan radian.
 * Semua fungsi berisi 'worklet' marker agar bisa dipakai di react-native-reanimated.
 */

/**
 * Normalize angle ke range [0, 360)
 * Contoh: normalizeAngle(370) → 10, normalizeAngle(-10) → 350
 */
export function normalizeAngle(angle: number): number {
  'worklet';
  return ((angle % 360) + 360) % 360;
}

/**
 * Hitung shortest rotation angle dari 'from' ke 'to'.
 * Result range: [-180, 180]
 *
 * Contoh:
 *   shortestRotation(10, 350) → -20 (rotate 20° counter-clockwise)
 *   shortestRotation(350, 10) → 20 (rotate 20° clockwise)
 *   shortestRotation(45, 135) → 90 (rotate 90° clockwise)
 */
export function shortestRotation(from: number, to: number): number {
  'worklet';
  const normalized_from = normalizeAngle(from);
  const normalized_to = normalizeAngle(to);
  let delta = normalized_to - normalized_from;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta;
}

/**
 * Convert radian to degree
 */
export function radianToDegree(radian: number): number {
  'worklet';
  return radian * (180 / Math.PI);
}

/**
 * Convert degree to radian
 */
export function degreeToRadian(degree: number): number {
  'worklet';
  return degree * (Math.PI / 180);
}

/**
 * Linear interpolation dengan shortest path (tidak wrap around 180°+)
 * Useful untuk smooth transitioning antara angles.
 *
 * @param from Starting angle (0-360)
 * @param to Target angle (0-360)
 * @param t Progress (0-1)
 */
export function lerpAngle(from: number, to: number, t: number): number {
  'worklet';
  const delta = shortestRotation(from, to);
  return normalizeAngle(from + delta * t);
}

/**
 * Apply smoothing dengan exponential moving average.
 * Useful untuk sensor jitter reduction.
 *
 * @param current Current angle
 * @param target Target angle
 * @param alpha Smoothing factor (0-1), higher = more responsive
 */
export function smoothAngle(current: number, target: number, alpha: number): number {
  'worklet';
  const delta = shortestRotation(current, target);
  return normalizeAngle(current + delta * alpha);
}

/**
 * Clamp angle ke range [center - range/2, center + range/2]
 * Useful untuk limiting arrow rotation agar tidak suddenly flip.
 *
 * @param angle Angle to clamp
 * @param center Center angle
 * @param range Range size (default 360 = no clamping)
 */
export function clampAngle(angle: number, center: number, range: number = 360): number {
  'worklet';
  if (range >= 360) return normalizeAngle(angle);

  const min = center - range / 2;
  const max = center + range / 2;

  // Normalize to center coordinate system
  let normalized = angle - center;
  if (normalized > 180) normalized -= 360;
  if (normalized < -180) normalized += 360;

  // Clamp
  if (normalized < -range / 2) normalized = -range / 2;
  if (normalized > range / 2) normalized = range / 2;

  return normalizeAngle(center + normalized);
}
