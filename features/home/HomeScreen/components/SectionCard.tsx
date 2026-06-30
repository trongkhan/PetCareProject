import { Spacing } from '@/constants/theme';
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
      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.left}>
            <View style={styles.header}>
              <Icon source={icon} size={18} color={theme.colors.primary} />
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
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
  card: {},
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  left: { flex: 1, gap: Spacing.xs },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  body: { paddingLeft: 26 },
});
