import { useState, useEffect, useCallback } from 'react';
import { Pet, CreatePetInput } from '@/models/types/Pet';
import { PetRepository } from '@/models/repositories/PetRepository';
import { IEditPetScreenUICallback, EditPetScreenActionsEnum } from './editPet.types';

interface UseViewModelProps {
  petId: string;
  handleUICallback: (action: IEditPetScreenUICallback) => void;
}

interface Selectors {
  pet: Pet | null;
  isLoading: boolean;
  isSaving: boolean;
}

interface Handlers {
  savePet: (input: Partial<CreatePetInput>) => void;
  navigateBack: () => void;
}

export const useViewModel = ({ petId, handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setPet(PetRepository.getById(petId));
    setIsLoading(false);
  }, [petId]);

  const savePet = useCallback((input: Partial<CreatePetInput>) => {
    setIsSaving(true);
    PetRepository.update(petId, input);
    setIsSaving(false);
    handleUICallback({ type: EditPetScreenActionsEnum.SaveSuccess });
  }, [petId, handleUICallback]);

  const navigateBack = useCallback(() => {
    handleUICallback({ type: EditPetScreenActionsEnum.NavigateBack });
  }, [handleUICallback]);

  return {
    selectors: { pet, isLoading, isSaving },
    handlers: { savePet, navigateBack },
  };
};
