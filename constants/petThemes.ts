import { MD3LightTheme } from 'react-native-paper';

export interface PetThemeConfig {
  id: string;
  label: string;
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
}

export const PET_THEMES: PetThemeConfig[] = [
  {
    id: 'teal',
    label: 'Teal',
    primary: '#0D9488',
    primaryContainer: '#CCFBF1',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#134E4A',
    secondary: '#FB923C',
    secondaryContainer: '#FED7AA',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#7C2D12',
  },
  {
    id: 'lavender',
    label: 'Lavender',
    primary: '#7C3AED',
    primaryContainer: '#EDE9FE',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#4C1D95',
    secondary: '#EC4899',
    secondaryContainer: '#FCE7F3',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#831843',
  },
  {
    id: 'rose',
    label: 'Hồng',
    primary: '#E11D48',
    primaryContainer: '#FFE4E6',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#9F1239',
    secondary: '#F59E0B',
    secondaryContainer: '#FEF3C7',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#78350F',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    primary: '#0369A1',
    primaryContainer: '#E0F2FE',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#0C4A6E',
    secondary: '#10B981',
    secondaryContainer: '#D1FAE5',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#064E3B',
  },
  {
    id: 'sunset',
    label: 'Hoàng hôn',
    primary: '#EA580C',
    primaryContainer: '#FFEDD5',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#7C2D12',
    secondary: '#8B5CF6',
    secondaryContainer: '#EDE9FE',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#4C1D95',
  },
];

export const DEFAULT_PET_THEME_ID = 'teal';

export function getPetTheme(id: string): PetThemeConfig {
  return PET_THEMES.find(t => t.id === id) ?? PET_THEMES[0];
}

export function buildPaperTheme(themeId: string) {
  const t = getPetTheme(themeId);
  return {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: t.primary,
      primaryContainer: t.primaryContainer,
      onPrimary: t.onPrimary,
      onPrimaryContainer: t.onPrimaryContainer,
      secondary: t.secondary,
      secondaryContainer: t.secondaryContainer,
      onSecondary: t.onSecondary,
      onSecondaryContainer: t.onSecondaryContainer,
      tertiary: '#8B5CF6',
      tertiaryContainer: '#EDE9FE',
      onTertiary: '#FFFFFF',
      onTertiaryContainer: '#4C1D95',
      surface: '#FFFFFF',
      surfaceVariant: '#F5F5F5',
      background: '#FFFBF5',
      error: '#B00020',
      onSurface: '#1C1B1F',
      onSurfaceVariant: '#49454F',
      outline: '#79747E',
      outlineVariant: '#CAC4D0',
    },
  };
}
