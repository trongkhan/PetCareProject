import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFeedingViewModel } from './useFeedingViewModel';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function FeedingScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const vm = useFeedingViewModel();

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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hôm nay ({vm.todayMeals.length} bữa)</Text>
          <TouchableOpacity
            style={[styles.logButton, { backgroundColor: colors.tint }]}
            onPress={() => vm.logMeal({ type: 'breakfast', food: 'Hạt khô', amount: 100, unit: 'grams' })}
          >
            <Text style={styles.logButtonText}>+ Ghi bữa</Text>
          </TouchableOpacity>
        </View>

        {vm.todayMeals.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.icon }]}>Chưa có bữa ăn nào hôm nay</Text>
        ) : (
          vm.todayMeals.map(meal => (
            <View key={meal.id} style={[styles.card, { borderColor: colors.icon }]}>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{meal.food}</Text>
                <Text style={[styles.cardSub, { color: colors.icon }]}>
                  {meal.type} • {meal.amount} {meal.unit}
                </Text>
              </View>
              <TouchableOpacity onPress={() => vm.deleteMeal(meal.id)}>
                <Text style={{ color: 'red', fontSize: 13 }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Lịch sử ({vm.meals.length})</Text>
        {vm.meals.slice(0, 10).map(meal => (
          <View key={meal.id} style={[styles.card, { borderColor: colors.icon }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{meal.food}</Text>
            <Text style={[styles.cardSub, { color: colors.icon }]}>
              {new Date(meal.timestamp).toLocaleDateString('vi-VN')} • {meal.type}
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
  cardContent: { gap: 4 },
  cardTitle: { fontSize: 15, fontWeight: '500' },
  cardSub: { fontSize: 13 },
  emptyText: { fontSize: 14, fontStyle: 'italic' },
  logButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  logButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
