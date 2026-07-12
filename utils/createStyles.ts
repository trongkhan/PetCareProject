import type { AppTheme } from '@/constants/colors';
import { StyleSheet } from 'react-native';
import type { MD3Theme } from 'react-native-paper';

/**
 * Style factory helper. The factory receives the full AppTheme (Paper theme +
 * our semantic tokens) so colors live in style files, not inline in JSX.
 * The returned hook accepts an MD3Theme (what `useTheme()` yields) since at
 * runtime that object always carries the semantic tokens.
 */
export function createStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: AppTheme) => T
) {
  return (theme: MD3Theme): T => StyleSheet.create(factory(theme as AppTheme));
}
