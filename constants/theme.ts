import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const PetTheme = {
  light: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#4CAF50',
      primaryContainer: '#C8E6C9',
      secondary: '#FF8A65',
      secondaryContainer: '#FFD0BC',
      tertiary: '#42A5F5',
      tertiaryContainer: '#BBDEFB',
      surface: '#FFFFFF',
      surfaceVariant: '#F5F5F5',
      background: '#FAFAFA',
      error: '#B00020',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#1B5E20',
      onSecondary: '#FFFFFF',
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
      primary: '#81C784',
      primaryContainer: '#2E7D32',
      secondary: '#FFAB91',
      secondaryContainer: '#BF360C',
      tertiary: '#90CAF9',
      tertiaryContainer: '#1565C0',
      surface: '#1C1B1F',
      surfaceVariant: '#2C2C2C',
      background: '#141218',
      error: '#CF6679',
      onPrimary: '#1B5E20',
      onPrimaryContainer: '#C8E6C9',
      onSecondary: '#5D1600',
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
