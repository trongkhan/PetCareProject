import { useState, useEffect, useCallback } from 'react';
import { Pet } from '@/models/types/Pet';
import { Meal } from '@/models/types/Meal';
import { Reminder } from '@/models/types/Reminder';
import { PetRepository } from '@/models/repositories/PetRepository';
import { MealRepository } from '@/models/repositories/MealRepository';
import { ReminderRepository } from '@/models/repositories/ReminderRepository';
import { useActivePetStore } from '@/store/activePetStore';

interface HomeViewModel {
  pet: Pet | null;
  allPets: Pet[];
  todayMeals: Meal[];
  upcomingReminders: Reminder[];
  isLoading: boolean;
  switchPet: (petId: string) => void;
  refresh: () => void;
}

export function useHomeViewModel(): HomeViewModel {
  const { activePetId, setActivePetId } = useActivePetStore();
  const [pet, setPet] = useState<Pet | null>(null);
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    setIsLoading(true);
    try {
      const pets = PetRepository.getAll();
      setAllPets(pets);

      const currentPetId = activePetId ?? pets[0]?.id ?? null;
      if (currentPetId && !activePetId) setActivePetId(currentPetId);

      if (currentPetId) {
        const currentPet = PetRepository.getById(currentPetId);
        setPet(currentPet);
        setTodayMeals(MealRepository.getTodayByPetId(currentPetId));
        setUpcomingReminders(ReminderRepository.getEnabled(currentPetId));
      } else {
        setPet(null);
        setTodayMeals([]);
        setUpcomingReminders([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activePetId, setActivePetId]);

  useEffect(() => {
    load();
  }, [load]);

  const switchPet = useCallback((petId: string) => {
    setActivePetId(petId);
  }, [setActivePetId]);

  return { pet, allPets, todayMeals, upcomingReminders, isLoading, switchPet, refresh: load };
}
