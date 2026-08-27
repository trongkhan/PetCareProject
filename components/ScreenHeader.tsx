import { router } from 'expo-router';
import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';

interface Props {
  title: string;
  /** Defaults to router.back(). */
  onBack?: () => void;
  /** Optional trailing actions, e.g. <Appbar.Action icon="pencil" … />. */
  children?: React.ReactNode;
}

/**
 * The back-navigating header shared by every pushed screen. Extracted because
 * seven screens repeated the same Appbar.Header + BackAction + Content block,
 * each re-declaring the surface background inline.
 *
 * Leaves `statusBarHeight` unset so Appbar.Header falls back to its own
 * useSafeAreaInsets() top inset — that holds regardless of whether the
 * screen sits inside a BaseScreen with `edges: ['top', ...]` or is presented
 * as a modal (modal presentation does NOT auto-inset on Android, unlike iOS,
 * so hardcoding 0 for "modal screens" left the header flush under the status
 * bar there).
 */
export function ScreenHeader({ title, onBack, children }: Props) {
  const theme = useTheme();
  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
      <Appbar.BackAction onPress={onBack ?? (() => router.back())} />
      <Appbar.Content title={title} />
      {children}
    </Appbar.Header>
  );
}
