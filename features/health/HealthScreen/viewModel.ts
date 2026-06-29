import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { HealthRecord, CreateHealthRecordInput, WeightEntry } from '@/models/types/HealthRecord';
import { HealthRepository } from '@/models/repositories/HealthRepository';
import { useActivePetStore } from '@/store/activePetStore';
import { IHealthScreenUICallback } from './types';

interface UseViewModelProps {
  handleUICallback: (action: IHealthScreenUICallback) => void;
}

interface Selectors {
  records: HealthRecord[];
  vaccinations: HealthRecord[];
  weightHistory: WeightEntry[];
  isLoading: boolean;
}

interface Handlers {
  addRecord: (input: Omit<CreateHealthRecordInput, 'petId'>) => void;
  deleteRecord: (id: string) => void;
  refresh: () => void;
}

export const useViewModel = ({ handleUICallback: _handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const { activePetId } = useActivePetStore();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [vaccinations, setVaccinations] = useState<HealthRecord[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    if (!activePetId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      setRecords(HealthRepository.getByPetId(activePetId));
      setVaccinations(HealthRepository.getByType(activePetId, 'vaccination'));
      setWeightHistory(HealthRepository.getWeightHistory(activePetId));
    } finally {
      setIsLoading(false);
    }
  }, [activePetId]);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const addRecord = useCallback((input: Omit<CreateHealthRecordInput, 'petId'>) => {
    if (!activePetId) return;
    const saved = HealthRepository.create({ ...input, petId: activePetId });
    setRecords(prev => [saved, ...prev]);
    if (saved.type === 'vaccination') setVaccinations(prev => [saved, ...prev]);
  }, [activePetId]);

  const deleteRecord = useCallback((id: string) => {
    HealthRepository.delete(id);
    setRecords(prev => prev.filter(r => r.id !== id));
    setVaccinations(prev => prev.filter(r => r.id !== id));
  }, []);

  return {
    selectors: { records, vaccinations, weightHistory, isLoading },
    handlers: { addRecord, deleteRecord, refresh: load },
  };
};
