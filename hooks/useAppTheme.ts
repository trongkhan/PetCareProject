import type { AppTheme } from '@/constants/colors';
import { useTheme } from 'react-native-paper';

/**
 * Access the active Paper theme extended with our semantic tokens
 * (warning/text palette). Reacts automatically to the dark/light mode
 * because the PaperProvider theme in the root layout is rebuilt from
 * `settingsStore.colorScheme`.
 *
 * Usage: const theme = useAppTheme(); theme.colors.warning; theme.dark;
 */
export function useAppTheme(): AppTheme {
  return useTheme<AppTheme>();
}
