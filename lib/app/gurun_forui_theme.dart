import 'package:flutter/material.dart';
import 'package:forui/forui.dart';

import 'app_colors.dart';

/// ForUI themes mapped 1:1 from the app token set (`app_colors.dart`,
/// themselves faithful HSL→hex ports of the legacy `global.css`).
///
/// Usage (see `router.dart`): wrap `MaterialApp.router` output with
/// `FTheme(data: resolved, child: FToaster(...))` and read tokens via
/// `context.theme.colors` / `context.theme.typography` (ForUI-first).
/// The existing Material `ThemeData` stays for Material widgets.
///
/// Top-level finals (not getters) so `FTheme` sees stable `==` instances
/// across rebuilds and never flickers.
final FThemeData gurunLightTheme = _buildLight();
final FThemeData gurunDarkTheme = _buildDark();

FThemeData _buildLight() {
  final base = FTheme.neutral.light.touch;
  return FThemeData(
    colors: base.colors.copyWith(
      brightness: Brightness.light,
      background: AppColors.lightBackground,
      foreground: AppColors.lightForeground,
      primary: AppColors.lightPrimary,
      primaryForeground: AppColors.lightPrimaryForeground,
      secondary: AppColors.lightSecondary,
      secondaryForeground: AppColors.lightSecondaryForeground,
      muted: AppColors.lightMuted,
      mutedForeground: AppColors.lightMutedForeground,
      destructive: AppColors.lightDestructive,
      destructiveForeground: AppColors.lightDestructiveForeground,
      error: AppColors.lightDestructive,
      errorForeground: AppColors.lightDestructiveForeground,
      card: AppColors.lightCard,
      border: AppColors.lightBorder,
    ),
    typography: _poppins(base.typography),
    touch: true,
  );
}

/// Dark twin of [gurunLightTheme].
FThemeData _buildDark() {
  final base = FTheme.neutral.dark.touch;
  return FThemeData(
    colors: base.colors.copyWith(
      brightness: Brightness.dark,
      background: AppColors.darkBackground,
      foreground: AppColors.darkForeground,
      primary: AppColors.darkPrimary,
      primaryForeground: AppColors.darkPrimaryForeground,
      secondary: AppColors.darkSecondary,
      secondaryForeground: AppColors.darkSecondaryForeground,
      muted: AppColors.darkMuted,
      mutedForeground: AppColors.darkMutedForeground,
      destructive: AppColors.darkDestructive,
      destructiveForeground: AppColors.darkDestructiveForeground,
      error: AppColors.darkDestructive,
      errorForeground: AppColors.darkDestructiveForeground,
      card: AppColors.darkCard,
      border: AppColors.darkBorder,
    ),
    typography: _poppins(base.typography),
    touch: true,
  );
}

/// Poppins is the app sans (bundled in `assets/fonts`, declared in pubspec).
FTypography _poppins(FTypography typography) => typography.copyWith(
  display: FTypeface(fontFamily: 'Poppins'),
  body: FTypeface(fontFamily: 'Poppins'),
);
