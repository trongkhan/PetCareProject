import { useState, useEffect, useCallback } from 'react';
import { Pet, CreatePetInput } from '@/models/types/Pet';
import { PetRepository } from '@/models/repositories/PetRepository';
import { useActivePetStore } from '@/store/activePetStore';
import { IPetProfileScreenUICallback, PetProfileScreenActionsEnum } from './PetProfileScreen.types';

interface UseViewModelProps {
  petId: string;
  handleUICallback: (action: IPetProfileScreenUICallback) => void;
}

interface Selectors {
  pet: Pet | null;
  isLoading: boolean;
}

interface Handlers {
  updatePet: (input: Partial<CreatePetInput>) => void;
  deletePet: () => void;
  navigateBack: () => void;
  confirmDeletePet: () => void;
}

export const useViewModel = ({ petId, handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const { setActivePetId } = useActivePetStore();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setPet(PetRepository.getById(petId));
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
    selectors: { pet, isLoading },
    handlers: { updatePet, deletePet, navigateBack, confirmDeletePet },
  };
};
