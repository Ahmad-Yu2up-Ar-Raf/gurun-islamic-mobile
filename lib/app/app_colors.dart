import 'package:flutter/material.dart';

/// Design tokens ported 1:1 from `global.css` (canonical source of truth).
/// Values were converted from HSL to hex at author time; spot-checked
/// against Tailwind palette anchors (rose-600, red-900, zinc-400).
/// NOTE: `lib/theme.ts` light `muted` diverges from CSS — CSS wins here.
abstract final class AppColors {
  // Light
  static const lightBackground = Color(0xFFFBF7F3);
  static const lightForeground = Color(0xFF1F1F1F);
  static const lightCard = Color(0xFFF9E8CD);
  static const lightCardForeground = Color(0xFF1F1F1F);
  static const lightPopover = Color(0xFFFBF7F3);
  static const lightPopoverForeground = Color(0xFF1F1F1F);
  static const lightPrimary = Color(0xFFFFB030);
  static const lightPrimaryForeground = Color(0xFFFBF7F3);
  static const lightSecondary = Color(0xFF874D14);
  static const lightSecondaryForeground = Color(0xFFFBF7F3);
  static const lightMuted = Color(0xFFF4F5F4);
  static const lightMutedForeground = Color(0xFF78716C);
  static const lightAccent = Color(0xFFFFF0D6);
  static const lightAccentForeground = Color(0xFF874D14);
  static const lightDestructive = Color(0xFFE11D48);
  static const lightDestructiveForeground = Color(0xFFFBF7F3);
  static const lightBorder = Color(0xFFE5E5E5);
  static const lightInput = Color(0xFFFBF7F3);
  static const lightRing = Color(0xFFFFB030);

  // Dark
  static const darkBackground = Color(0xFF121212);
  static const darkForeground = Color(0xFFFCFAF7);
  static const darkCard = Color(0xFF1E1E1E);
  static const darkCardForeground = Color(0xFFFCFAF7);
  static const darkPopover = Color(0xFF1E1E1E);
  static const darkPopoverForeground = Color(0xFFFCFAF7);
  static const darkPrimary = Color(0xFFFFB030);
  static const darkPrimaryForeground = Color(0xFF121212);
  static const darkSecondary = Color(0xFFA67B5B);
  static const darkSecondaryForeground = Color(0xFFFBF7F3);
  static const darkMuted = Color(0xFF2A2A2A);
  static const darkMutedForeground = Color(0xFFA1A1AA);
  static const darkAccent = Color(0xFF332A1B);
  static const darkAccentForeground = Color(0xFFFFB030);
  static const darkDestructive = Color(0xFF7F1D1D);
  static const darkDestructiveForeground = Color(0xFFFCFAF7);
  static const darkBorder = Color(0xFF2A2A2A);
  static const darkInput = Color(0xFF1E1E1E);
  static const darkRing = Color(0xFFFFB030);

  static Color backgroundOf(Brightness b) =>
      b == Brightness.dark ? darkBackground : lightBackground;
}

/// 4-point spacing scale (Tailwind `0.25rem` base). Screen edge = [md].
abstract final class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 16;
  static const double lg = 24;
  static const double xl = 32;
  static const double xxl = 48;
}

/// Radius scale (`--radius: 0.75rem` → lg 12, md 10, sm 8).
abstract final class AppRadius {
  static const double sm = 8;
  static const double md = 10;
  static const double lg = 12;
  static const double full = 9999;
}

/// Motion durations (fast 150 / base 250 / slow 400 + accordion 200).
abstract final class AppMotion {
  static const fast = Duration(milliseconds: 150);
  static const base = Duration(milliseconds: 250);
  static const slow = Duration(milliseconds: 400);
  static const accordion = Duration(milliseconds: 200);
}

/// Shadow tokens (light y4/blur10/a.05, dark y6/blur15/a.4).
abstract final class AppShadows {
  static List<BoxShadow> cardOf(Brightness b) => [
    BoxShadow(
      color: const Color(0xFF000000)
          .withValues(alpha: b == Brightness.dark ? 0.4 : 0.05),
      offset: Offset(0, b == Brightness.dark ? 6 : 4),
      blurRadius: b == Brightness.dark ? 15 : 10,
    ),
  ];
}
