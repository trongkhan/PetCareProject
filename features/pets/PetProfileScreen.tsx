import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { usePetProfileViewModel } from './usePetProfileViewModel';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Props {
  petId: string;
}

export function PetProfileScreen({ petId }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const vm = usePetProfileViewModel(petId);

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
        <Text style={{ color: colors.text }}>Không tìm thấy thú cưng</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Xóa thú cưng', `Bạn có chắc muốn xóa ${vm.pet!.name}?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => { vm.deletePet(); router.replace('/'); } },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.tint }]}>
        <Text style={styles.name}>{vm.pet.name}</Text>
        <Text style={styles.species}>{vm.pet.species} • {vm.pet.gender}</Text>
      </View>

      <View style={styles.section}>
        <InfoRow label="Giống" value={vm.pet.breed} colors={colors} />
        <InfoRow label="Cân nặng" value={`${vm.pet.weight} kg`} colors={colors} />
        {vm.pet.birthday && <InfoRow label="Ngày sinh" value={new Date(vm.pet.birthday).toLocaleDateString('vi-VN')} colors={colors} />}
        {vm.pet.microchip && <InfoRow label="Microchip" value={vm.pet.microchip} colors={colors} />}
        {vm.pet.notes && <InfoRow label="Ghi chú" value={vm.pet.notes} colors={colors} />}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.deleteText}>Xóa thú cưng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value, colors }: { label: string; value: string; colors: typeof Colors.light }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.label, { color: colors.icon }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 24, paddingTop: 32, alignItems: 'center', gap: 4 },
  name: { fontSize: 28, fontWeight: '700', color: '#fff' },
  species: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  section: { padding: 16, gap: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '500' },
  footer: { padding: 16 },
  deleteButton: { padding: 14, borderRadius: 8, borderWidth: 1, borderColor: 'red', alignItems: 'center' },
  deleteText: { color: 'red', fontWeight: '600' },
});
