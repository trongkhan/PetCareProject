import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRemindersViewModel } from './useRemindersViewModel';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function RemindersScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const vm = useRemindersViewModel();

  if (vm.isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Nhắc nhở ({vm.reminders.length})</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.tint }]}
            onPress={() => vm.addReminder({
              type: 'feeding',
              title: 'Cho ăn buổi sáng',
              frequency: 'daily',
              time: '07:00',
            })}
          >
            <Text style={styles.addButtonText}>+ Thêm</Text>
          </TouchableOpacity>
        </View>

        {vm.reminders.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.icon }]}>Chưa có nhắc nhở nào</Text>
        ) : (
          vm.reminders.map(reminder => (
            <View key={reminder.id} style={[styles.card, { borderColor: colors.icon }]}>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{reminder.title}</Text>
                <Text style={[styles.cardSub, { color: colors.icon }]}>
                  {reminder.time} • {reminder.frequency}
                </Text>
              </View>
              <View style={styles.actions}>
                <Switch
                  value={reminder.enabled}
                  onValueChange={(val) => vm.toggleReminder(reminder.id, val)}
                  trackColor={{ true: colors.tint }}
                />
                <TouchableOpacity onPress={() => vm.deleteReminder(reminder.id)}>
                  <Text style={{ color: 'red', fontSize: 13 }}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { padding: 16, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  card: { padding: 12, borderRadius: 8, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardContent: { gap: 4, flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '500' },
  cardSub: { fontSize: 13 },
  emptyText: { fontSize: 14, fontStyle: 'italic' },
  addButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
