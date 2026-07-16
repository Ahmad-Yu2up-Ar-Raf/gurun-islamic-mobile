import { DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation';

export const THEME = {
  light: {
    background: 'hsl(26, 54%, 97%)',
    foreground: 'hsl(0 0% 12.1569%)',

    card: 'hsl(37, 79%, 89%)',
    cardForeground: 'hsl(0 0% 12.1569%)',

    popover: 'hsl(26, 54%, 97%)',
    popoverForeground: 'hsl(0 0% 12.1569%)',

    primary: 'hsl(37.1014 100% 59.4118%)',
    primaryForeground: 'hsl(26, 54%, 97%)',

    secondary: 'hsl(29.7391 74.1935% 30.3922%)',
    secondaryForeground: 'hsl(26, 54%, 97%)',

    muted: 'hsl(30, 50%, 98%)',
    mutedForeground: 'hsl(30 30.4% 30.4%)',

    accent: 'hsl(38.0488 100% 91.9608%)',
    accentForeground: 'hsl(29.7391 74.1935% 30.3922%)',

    destructive: 'hsl(346.8367 77.1654% 49.8039%)',
    destructiveForeground: 'hsl(26, 54%, 97%)',

    border: 'hsl(0 0% 89.8039%)',
    input: 'hsl(26, 54%, 97%)',
    ring: 'hsl(37.1014 100% 59.4118%)',
  },

  dark: {
    background: 'hsl(0 0% 7.0588%)',
    foreground: 'hsl(30, 50%, 98%)',

    card: 'hsl(0 0% 11.7647%)',
    cardForeground: 'hsl(30, 50%, 98%)',

    popover: 'hsl(0 0% 11.7647%)',
    popoverForeground: 'hsl(30, 50%, 98%)',

    primary: 'hsl(37.1014 100% 59.4118%)',
    primaryForeground: 'hsl(0 0% 7.0588%)',

    secondary: 'hsl(25.6000 29.6443% 50.3922%)',
    secondaryForeground: 'hsl(26, 54%, 97%)',

    muted: 'hsl(0 0% 16.4706%)',
    mutedForeground: 'hsl(240 5.0279% 64.9020%)',

    accent: 'hsl(37.5 30.7692% 15.2941%)',
    accentForeground: 'hsl(37.1014 100% 59.4118%)',

    destructive: 'hsl(0 62.8205% 30.5882%)',
    destructiveForeground: 'hsl(30, 50%, 98%)',

    border: 'hsl(0 0% 16.4706%)',
    input: 'hsl(0 0% 11.7647%)',
    ring: 'hsl(37.1014 100% 59.4118%)',
  },
} as const;
export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
