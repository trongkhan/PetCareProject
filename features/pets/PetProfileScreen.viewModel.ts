import { useState, useEffect, useCallback } from 'react';
import { Pet, CreatePetInput } from '@/models/types/Pet';
import { WeightEntry } from '@/models/types/HealthRecord';
import { PetRepository } from '@/models/repositories/PetRepository';
import { HealthRepository } from '@/models/repositories/HealthRepository';
import { useActivePetStore } from '@/store/activePetStore';
import { IPetProfileScreenUICallback, PetProfileScreenActionsEnum } from './PetProfileScreen.types';

interface UseViewModelProps {
  petId: string;
  handleUICallback: (action: IPetProfileScreenUICallback) => void;
}

interface Selectors {
  pet: Pet | null;
  weightHistory: WeightEntry[];
  isLoading: boolean;
}

interface Handlers {
  updatePet: (input: Partial<CreatePetInput>) => void;
  deletePet: () => void;
  navigateBack: () => void;
  navigateEdit: () => void;
  confirmDeletePet: () => void;
}

export const useViewModel = ({ petId, handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const { setActivePetId } = useActivePetStore();
  const [pet, setPet] = useState<Pet | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setPet(PetRepository.getById(petId));
    setWeightHistory(HealthRepository.getWeightHistory(petId));
    setIsLoading(false);
  }, [petId]);

  const updatePet = useCallback((input: Partial<CreatePetInput>) => {
    const updated = PetRepository.update(petId, input);
    setPet(updated);
  }, [petId]);

  const deletePet = useCallback(() => {
    PetRepository.delete(petId);
    setActivePetId(null);
  }, [petId, setActivePetId]);

  const navigateBack = useCallback(() => {
    handleUICallback({ type: PetProfileScreenActionsEnum.NavigateBack });
  }, [handleUICallback]);

  const navigateEdit = useCallback(() => {
    handleUICallback({ type: PetProfileScreenActionsEnum.NavigateEdit, payload: { petId } });
  }, [petId, handleUICallback]);

  const confirmDeletePet = useCallback(() => {
    if (!pet) return;
    handleUICallback({
      type: PetProfileScreenActionsEnum.ConfirmDeletePet,
      payload: {
        petName: pet.name,
        onConfirm: deletePet,
      },
    });
  }, [pet, deletePet, handleUICallback]);

  return {
    selectors: { pet, weightHistory, isLoading },
    handlers: { updatePet, deletePet, navigateBack, navigateEdit, confirmDeletePet },
  };
};
