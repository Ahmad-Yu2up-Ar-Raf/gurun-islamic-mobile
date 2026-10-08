import 'package:flutter/material.dart';

/// Named text styles (never raw font sizes in screens).
class ThemedText extends StatelessWidget {
  const ThemedText(
    this.data, {
    super.key,
    this.variant = TextVariant.body,
    this.color,
    this.align,
    this.maxLines,
    this.uppercase = false,
  });

  final String data;
  final TextVariant variant;
  final Color? color;
  final TextAlign? align;
  final int? maxLines;
  final bool uppercase;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    final base = switch (variant) {
      TextVariant.display => theme.displayLarge,
      TextVariant.title => theme.titleLarge,
      TextVariant.headline => theme.titleMedium,
      TextVariant.body => theme.bodyLarge,
      TextVariant.subhead => theme.bodyMedium,
      TextVariant.caption => theme.bodySmall,
    };
    return Text(
      uppercase ? data.toUpperCase() : data,
      style: base?.copyWith(color: color),
      textAlign: align,
      maxLines: maxLines,
      overflow: maxLines == null ? null : TextOverflow.ellipsis,
    );
  }
}

enum TextVariant { display, title, headline, body, subhead, caption }

/// Right-aligned Arabic script in the bundled Naskh face.
class ArabicText extends StatelessWidget {
  const ArabicText(
    this.data, {
    super.key,
    this.fontSize = 24,
    this.color,
    this.align = TextAlign.right,
    this.maxLines,
  });

  final String data;
  final double fontSize;
  final Color? color;
  final TextAlign align;
  final int? maxLines;

  @override
  Widget build(BuildContext context) {
    return Text(
      data,
      textAlign: align,
      maxLines: maxLines,
      overflow: maxLines == null ? null : TextOverflow.ellipsis,
      style: TextStyle(
        fontFamily: 'Arabic',
        fontSize: fontSize,
        height: 1.9,
        color: color ?? Theme.of(context).colorScheme.onSurface,
      ),
    );
  }
}

/// Teko semibold display text (`Bismillah`, headers).
class TekoText extends StatelessWidget {
  const TekoText(
    this.data, {
    super.key,
    this.fontSize = 30,
    this.color,
    this.align,
  });

  final String data;
  final double fontSize;
  final Color? color;
  final TextAlign? align;

  @override
  Widget build(BuildContext context) {
    return Text(
      data,
      textAlign: align,
      style: TextStyle(
        fontFamily: 'Teko',
        fontSize: fontSize,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.5,
        color: color ?? Theme.of(context).colorScheme.onSurface,
      ),
    );
  }
}
