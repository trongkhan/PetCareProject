import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useCreatePetViewModel } from './useCreatePetViewModel';
import { PetSpecies, PetGender } from '@/models/types/Pet';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function CreatePetScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const vm = useCreatePetViewModel();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('dog');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<PetGender>('male');
  const [weight, setWeight] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    vm.createPet({
      name: name.trim(),
      species,
      breed: breed.trim(),
      gender,
      weight: parseFloat(weight) || 0,
    });
  };

  const SPECIES: PetSpecies[] = ['dog', 'cat', 'bird', 'hamster', 'rabbit', 'other'];
  const SPECIES_LABELS: Record<PetSpecies, string> = {
    dog: 'Chó', cat: 'Mèo', bird: 'Chim', hamster: 'Hamster', fish: 'Cá', rabbit: 'Thỏ', other: 'Khác',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Thêm thú cưng mới</Text>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.icon }]}>Tên *</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
          value={name}
          onChangeText={setName}
          placeholder="Tên thú cưng"
          placeholderTextColor={colors.icon}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.icon }]}>Loài</Text>
        <View style={styles.chipRow}>
          {SPECIES.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, { borderColor: colors.icon, backgroundColor: species === s ? colors.tint : 'transparent' }]}
              onPress={() => setSpecies(s)}
            >
              <Text style={{ color: species === s ? '#fff' : colors.text, fontSize: 13 }}>{SPECIES_LABELS[s]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.icon }]}>Giống</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
          value={breed}
          onChangeText={setBreed}
          placeholder="VD: Corgi, Maine Coon..."
          placeholderTextColor={colors.icon}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.icon }]}>Giới tính</Text>
        <View style={styles.chipRow}>
          {(['male', 'female'] as PetGender[]).map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, { borderColor: colors.icon, backgroundColor: gender === g ? colors.tint : 'transparent' }]}
              onPress={() => setGender(g)}
            >
              <Text style={{ color: gender === g ? '#fff' : colors.text, fontSize: 13 }}>
                {g === 'male' ? 'Đực' : 'Cái'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.icon }]}>Cân nặng (kg)</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
          value={weight}
          onChangeText={setWeight}
          placeholder="VD: 5.2"
          placeholderTextColor={colors.icon}
          keyboardType="decimal-pad"
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: name.trim() ? colors.tint : colors.icon }]}
        onPress={handleCreate}
        disabled={!name.trim() || vm.isSubmitting}
      >
        <Text style={styles.submitText}>
          {vm.isSubmitting ? 'Đang tạo...' : 'Tạo thú cưng'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: '700', marginBottom: 24, marginTop: 8 },
  field: { marginBottom: 20 },
  label: { fontSize: 13, marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  submitButton: { padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8, marginBottom: 40 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
