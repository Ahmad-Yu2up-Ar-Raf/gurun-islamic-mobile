import 'package:flutter/material.dart';

import 'app_colors.dart';

/// 1:1 port of the NativeWind theme: HSL tokens → [ColorScheme],
/// Poppins/Teko ramp → [TextTheme], radius 12/10/8.
/// Arabic script uses the bundled `Arabic` family (see themed_text.dart).
ThemeData buildAppTheme(Brightness brightness) {
  final dark = brightness == Brightness.dark;
  final scheme = ColorScheme(
    brightness: brightness,
    primary: dark ? AppColors.darkPrimary : AppColors.lightPrimary,
    onPrimary: dark
        ? AppColors.darkPrimaryForeground
        : AppColors.lightPrimaryForeground,
    secondary: dark ? AppColors.darkSecondary : AppColors.lightSecondary,
    onSecondary: dark
        ? AppColors.darkSecondaryForeground
        : AppColors.lightSecondaryForeground,
    tertiaryContainer: dark ? AppColors.darkAccent : AppColors.lightAccent,
    onTertiaryContainer: dark
        ? AppColors.darkAccentForeground
        : AppColors.lightAccentForeground,
    error: dark ? AppColors.darkDestructive : AppColors.lightDestructive,
    onError: dark
        ? AppColors.darkDestructiveForeground
        : AppColors.lightDestructiveForeground,
    surface: dark ? AppColors.darkBackground : AppColors.lightBackground,
    onSurface: dark ? AppColors.darkForeground : AppColors.lightForeground,
    surfaceContainer: dark ? AppColors.darkCard : AppColors.lightCard,
    surfaceContainerHigh: dark ? AppColors.darkPopover : AppColors.lightPopover,
    surfaceContainerLowest: dark ? AppColors.darkMuted : AppColors.lightMuted,
    onSurfaceVariant: dark
        ? AppColors.darkMutedForeground
        : AppColors.lightMutedForeground,
    outline: dark ? AppColors.darkBorder : AppColors.lightBorder,
  );

  const poppins = TextStyle(fontFamily: 'Poppins');
  final TextTheme appTextTheme = TextTheme(
    displayLarge: poppins.copyWith(fontSize: 34, fontWeight: FontWeight.w700),
    titleLarge: poppins.copyWith(fontSize: 22, fontWeight: FontWeight.w600),
    titleMedium: poppins.copyWith(fontSize: 17, fontWeight: FontWeight.w600),
    bodyLarge: poppins.copyWith(fontSize: 17, fontWeight: FontWeight.w400),
    bodyMedium: poppins.copyWith(fontSize: 15, fontWeight: FontWeight.w400),
    bodySmall: poppins.copyWith(fontSize: 12, fontWeight: FontWeight.w400),
  );

  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: scheme.surface,
    textTheme: appTextTheme,
    dividerTheme: DividerThemeData(color: scheme.outline, thickness: 0.5),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: scheme.surface,
      indicatorColor: Colors.transparent,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return TextStyle(
          fontFamily: 'Poppins',
          fontSize: 12,
          fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
          color: selected ? scheme.secondary : scheme.onSurfaceVariant,
        );
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return IconThemeData(
          color: selected ? scheme.secondary : scheme.onSurfaceVariant,
        );
      }),
    ),
    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) return scheme.primary;
        return null;
      }),
      trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return scheme.primary.withValues(alpha: 0.5);
        }
        return null;
      }),
    ),
    cardTheme: CardThemeData(
      color: scheme.surface,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: dark ? AppColors.darkInput : AppColors.lightInput,
      focusedBorder: OutlineInputBorder(
        borderSide: BorderSide(
          color: dark ? AppColors.darkRing : AppColors.lightRing,
        ),
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
    ),
  );
}

/// Teko display style (clock digits, `Bismillah`, tab titles).
TextStyle tekoStyle({
  required BuildContext context,
  double fontSize = 30,
  FontWeight fontWeight = FontWeight.w600,
  Color? color,
}) => TextStyle(
  fontFamily: 'Teko',
  fontSize: fontSize,
  fontWeight: fontWeight,
  letterSpacing: -0.5,
  color: color ?? Theme.of(context).colorScheme.onSurface,
);

/// Schluber display style (home clock digits).
TextStyle schluberStyle({
  required BuildContext context,
  double fontSize = 72,
  Color? color,
}) => TextStyle(
  fontFamily: 'Schluber',
  fontSize: fontSize,
  color: color ?? Theme.of(context).colorScheme.secondary,
);
