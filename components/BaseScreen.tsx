import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface BaseScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
}

export function BaseScreen({ children, edges = ['top', 'bottom'], style }: BaseScreenProps) {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
