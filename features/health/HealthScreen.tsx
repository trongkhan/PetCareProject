import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useHealthViewModel } from './useHealthViewModel';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function HealthScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const vm = useHealthViewModel();

  if (vm.isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Vaccinations */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tiêm phòng ({vm.vaccinations.length})</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.tint }]}
            onPress={() => vm.addRecord({
              type: 'vaccination',
              title: 'Vắc-xin dại',
              date: new Date().toISOString().split('T')[0],
              nextDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            })}
          >
            <Text style={styles.addButtonText}>+ Thêm</Text>
          </TouchableOpacity>
        </View>

        {vm.vaccinations.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.icon }]}>Chưa có lịch sử tiêm phòng</Text>
        ) : (
          vm.vaccinations.map(record => (
            <View key={record.id} style={[styles.card, { borderColor: colors.icon }]}>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{record.title}</Text>
                <Text style={[styles.cardSub, { color: colors.icon }]}>
                  {new Date(record.date).toLocaleDateString('vi-VN')}
                  {record.nextDue ? ` → ${new Date(record.nextDue).toLocaleDateString('vi-VN')}` : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => vm.deleteRecord(record.id)}>
                <Text style={{ color: 'red', fontSize: 13 }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* All records */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tất cả hồ sơ ({vm.records.length})</Text>
        {vm.records.map(record => (
          <View key={record.id} style={[styles.card, { borderColor: colors.icon }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{record.title}</Text>
            <Text style={[styles.cardSub, { color: colors.icon }]}>
              {record.type} • {new Date(record.date).toLocaleDateString('vi-VN')}
            </Text>
          </View>
        ))}
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
});
