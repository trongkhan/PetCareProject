import type { MD3Theme } from 'react-native-paper';

/**
 * Semantic colors that Material Design 3 (react-native-paper) doesn't provide
 * out of the box — warning/amber accents and an explicit text palette.
 * Defined once per mode here instead of being scattered as inline
 * `theme.dark ? '#a' : '#b'` ternaries across the screens.
 */
export interface AppSemanticColors {
  // Warning / attention (vaccination due, allergies…)
  warning: string;
  warningStrong: string;
  warningSurface: string;
  // Text palette
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
}

export const SEMANTIC_LIGHT: AppSemanticColors = {
  warning: '#E65100',
  warningStrong: '#BF360C',
  warningSurface: '#FFF3E0',
  textPrimary: '#1C1B1F',
  textSecondary: '#49454F',
  textMuted: '#79747E',
};

export const SEMANTIC_DARK: AppSemanticColors = {
  warning: '#FFB74D',
  warningStrong: '#FFCC80',
  warningSurface: '#3A2E12',
  textPrimary: '#ECE9EF',
  textSecondary: '#C9C4D0',
  textMuted: '#948F9C',
};

/** Paper's MD3 theme extended with our semantic color tokens. */
export type AppTheme = MD3Theme & {
  colors: MD3Theme['colors'] & AppSemanticColors;
};
