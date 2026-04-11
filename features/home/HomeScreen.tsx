import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useHomeViewModel } from './useHomeViewModel';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const vm = useHomeViewModel();

  if (vm.isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  if (!vm.pet) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Chưa có thú cưng nào</Text>
        <Text style={[styles.emptySubtitle, { color: colors.icon }]}>Thêm thú cưng đầu tiên của bạn</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={() => router.push('/pet/create')}
        >
          <Text style={styles.addButtonText}>+ Thêm thú cưng</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Pet header */}
      <View style={[styles.header, { backgroundColor: colors.tint }]}>
        <Text style={styles.petName}>{vm.pet.name}</Text>
        <Text style={styles.petInfo}>{vm.pet.breed} • {vm.pet.weight} kg</Text>
      </View>

      {/* Today's meals */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Bữa ăn hôm nay</Text>
        {vm.todayMeals.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.icon }]}>Chưa ghi nhận bữa ăn nào hôm nay</Text>
        ) : (
          vm.todayMeals.map(meal => (
            <View key={meal.id} style={[styles.card, { borderColor: colors.icon }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{meal.food}</Text>
              <Text style={[styles.cardSub, { color: colors.icon }]}>{meal.type} • {meal.amount} {meal.unit}</Text>
            </View>
          ))
        )}
      </View>

      {/* Upcoming reminders */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Nhắc nhở sắp tới</Text>
        {vm.upcomingReminders.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.icon }]}>Không có nhắc nhở nào</Text>
        ) : (
          vm.upcomingReminders.slice(0, 3).map(reminder => (
            <View key={reminder.id} style={[styles.card, { borderColor: colors.icon }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{reminder.title}</Text>
              <Text style={[styles.cardSub, { color: colors.icon }]}>{reminder.time} • {reminder.frequency}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  header: { padding: 24, paddingTop: 48 },
  petName: { fontSize: 28, fontWeight: '700', color: '#fff' },
  petInfo: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  section: { padding: 16, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  card: { padding: 12, borderRadius: 8, borderWidth: 1, gap: 4 },
  cardTitle: { fontSize: 15, fontWeight: '500' },
  cardSub: { fontSize: 13 },
  emptyText: { fontSize: 14, fontStyle: 'italic' },
  emptyTitle: { fontSize: 20, fontWeight: '600' },
  emptySubtitle: { fontSize: 14 },
  addButton: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
