import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { CreatePetInput } from '@/models/types/Pet';
import { PetRepository } from '@/models/repositories/PetRepository';
import { useActivePetStore } from '@/store/activePetStore';

interface CreatePetViewModel {
  isSubmitting: boolean;
  createPet: (input: CreatePetInput) => void;
}

export function useCreatePetViewModel(): CreatePetViewModel {
  const { setActivePetId } = useActivePetStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPet = useCallback((input: CreatePetInput) => {
    setIsSubmitting(true);
    try {
      const pet = PetRepository.create(input);
      setActivePetId(pet.id);
      router.replace('/');
    } finally {
      setIsSubmitting(false);
    }
  }, [setActivePetId]);

  return { isSubmitting, createPet };
}
