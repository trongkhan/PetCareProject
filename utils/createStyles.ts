import { StyleSheet } from 'react-native';
import type { MD3Theme } from 'react-native-paper';

export function createStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (theme: MD3Theme) => T
) {
  return (theme: MD3Theme): T => StyleSheet.create(factory(theme));
}
