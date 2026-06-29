import { useState, useCallback } from 'react';
import { CreatePetInput } from '@/models/types/Pet';
import { PetRepository } from '@/models/repositories/PetRepository';
import { useActivePetStore } from '@/store/activePetStore';
import { ICreatePetScreenUICallback, CreatePetScreenActionsEnum } from './CreatePetScreen.types';

interface UseViewModelProps {
  handleUICallback: (action: ICreatePetScreenUICallback) => void;
}

interface Selectors {
  isSubmitting: boolean;
}

interface Handlers {
  createPet: (input: CreatePetInput) => void;
  navigateBack: () => void;
}

export const useViewModel = ({ handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const { setActivePetId } = useActivePetStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPet = useCallback((input: CreatePetInput) => {
    setIsSubmitting(true);
    try {
      const pet = PetRepository.create(input);
      setActivePetId(pet.id);
      handleUICallback({ type: CreatePetScreenActionsEnum.NavigateHome });
    } finally {
      setIsSubmitting(false);
    }
  }, [setActivePetId, handleUICallback]);

  const navigateBack = useCallback(() => {
    handleUICallback({ type: CreatePetScreenActionsEnum.NavigateBack });
  }, [handleUICallback]);

  return {
    selectors: { isSubmitting },
    handlers: { createPet, navigateBack },
  };
};
