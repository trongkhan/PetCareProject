import { router } from 'expo-router';
import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';

interface Props {
  title: string;
  /** Defaults to router.back(). */
  onBack?: () => void;
  /** Optional trailing actions, e.g. <Appbar.Action icon="pencil" … />. */
  children?: React.ReactNode;
  /** Pass 0 on screens presented as a modal, where the stack already insets. */
  statusBarHeight?: number;
}

/**
 * The back-navigating header shared by every pushed screen. Extracted because
 * seven screens repeated the same Appbar.Header + BackAction + Content block,
 * each re-declaring the surface background inline.
 */
export function ScreenHeader({ title, onBack, children, statusBarHeight }: Props) {
  const theme = useTheme();
  return (
    <Appbar.Header statusBarHeight={statusBarHeight} style={{ backgroundColor: theme.colors.background }}>
      <Appbar.BackAction onPress={onBack ?? (() => router.back())} />
      <Appbar.Content title={title} />
      {children}
    </Appbar.Header>
  );
}
