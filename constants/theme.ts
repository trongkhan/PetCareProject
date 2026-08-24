import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const PetTheme = {
  light: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#0D9488',
      primaryContainer: '#CCFBF1',
      secondary: '#FB923C',
      secondaryContainer: '#FED7AA',
      tertiary: '#8B5CF6',
      tertiaryContainer: '#EDE9FE',
      surface: '#FFFFFF',
      surfaceVariant: '#F0FDFA',
      background: '#FFFBF5',
      error: '#B00020',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#134E4A',
      onSecondary: '#FFFFFF',
      onSecondaryContainer: '#7C2D12',
      onTertiary: '#FFFFFF',
      onTertiaryContainer: '#4C1D95',
      onSurface: '#1C1B1F',
      onSurfaceVariant: '#49454F',
      outline: '#79747E',
      outlineVariant: '#CAC4D0',
    },
  },
  dark: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: '#2DD4BF',
      primaryContainer: '#134E4A',
      secondary: '#FDBA74',
      secondaryContainer: '#9A3412',
      tertiary: '#A78BFA',
      tertiaryContainer: '#4C1D95',
      surface: '#1C1B1F',
      surfaceVariant: '#1A3330',
      background: '#141218',
      error: '#CF6679',
      onPrimary: '#003733',
      onPrimaryContainer: '#CCFBF1',
      onSecondary: '#431407',
      onSecondaryContainer: '#FED7AA',
      onTertiary: '#2E1065',
      onTertiaryContainer: '#EDE9FE',
      onSurface: '#E6E1E5',
      onSurfaceVariant: '#CAC4D0',
      outline: '#938F99',
      outlineVariant: '#49454F',
    },
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

/**
 * Vertical space a scrolling screen must reserve at the bottom so a floating
 * action button (56dp tall, offset Spacing.lg from the edge) can never cover
 * the last row of content.
 */
export const FabClearance = 96;
