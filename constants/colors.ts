import type { MD3Theme } from 'react-native-paper';

export interface AppSemanticColors {
  warning: string;
  warningStrong: string;
  warningSurface: string;
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

export type AppTheme = MD3Theme & {
  colors: MD3Theme['colors'] & AppSemanticColors;
};
