import { Radius, Spacing } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Icon, Text, useTheme } from 'react-native-paper';

interface Props {
  icon: string;
  title: string;
  onPress: () => void;
  children: React.ReactNode;
}

export function SectionCard({ icon, title, onPress, children }: Props) {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <Card mode="outlined" style={[styles.card, { borderColor: theme.colors.outlineVariant }]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.left}>
            <View style={styles.header}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconBadge}
              >
                <Icon source={icon} size={18} color={theme.colors.onPrimary} />
              </LinearGradient>
              <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
                {title}
              </Text>
            </View>
            <View style={styles.body}>
              {children}
            </View>
          </View>
          <Icon source="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Overrides the global card roundness (Radius.xl, tuned for pill-shaped
  // buttons/chips) with a softer rectangle for this list-row shape, and a
  // hairline border instead of Paper's default 1pt so the row reads as a
  // subtle divider rather than a hard outline.
  // minHeight + centered content keeps all three Home rows the same height
  // regardless of whether their body shows one line (empty state) or two.
  card: { borderRadius: Radius.lg, borderWidth: StyleSheet.hairlineWidth, minHeight: 96, justifyContent: 'center' },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  left: { flex: 1, gap: Spacing.xs },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  title: { fontWeight: '600' },
  iconBadge: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  body: { paddingLeft: 38 },
});
