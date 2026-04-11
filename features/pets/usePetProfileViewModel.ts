import { useState, useEffect, useCallback } from 'react';
import { Pet, CreatePetInput } from '@/models/types/Pet';
import { PetRepository } from '@/models/repositories/PetRepository';
import { useActivePetStore } from '@/store/activePetStore';

interface PetProfileViewModel {
  pet: Pet | null;
  isLoading: boolean;
  updatePet: (input: Partial<CreatePetInput>) => void;
  deletePet: () => void;
}

export function usePetProfileViewModel(petId: string): PetProfileViewModel {
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

  return { pet, isLoading, updatePet, deletePet };
}
