import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Pet } from '@/models/types/Pet';
import { Meal } from '@/models/types/Meal';
import { HealthRecord } from '@/models/types/HealthRecord';
import { Reminder } from '@/models/types/Reminder';
import { PetRepository } from '@/models/repositories/PetRepository';
import { MealRepository } from '@/models/repositories/MealRepository';
import { ReminderRepository } from '@/models/repositories/ReminderRepository';
import { HealthRepository } from '@/models/repositories/HealthRepository';
import { useActivePetStore } from '@/store/activePetStore';
import { IHomeScreenUICallback, HomeScreenActionsEnum } from './types';

interface UseViewModelProps {
  handleUICallback: (action: IHomeScreenUICallback) => void;
}

interface Selectors {
  pet: Pet | null;
  allPets: Pet[];
  todayMeals: Meal[];
  upcomingReminders: Reminder[];
  upcomingVaccinations: HealthRecord[];
  isLoading: boolean;
}

interface Handlers {
  switchPet: (petId: string) => void;
  refresh: () => void;
  navigateCreatePet: () => void;
  navigatePetProfile: (petId: string) => void;
  navigateFeeding: () => void;
  navigateReminders: () => void;
}

export const useViewModel = ({ handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const { activePetId, setActivePetId } = useActivePetStore();
  const [pet, setPet] = useState<Pet | null>(null);
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [upcomingVaccinations, setUpcomingVaccinations] = useState<HealthRecord[]>([]);
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
        const now = new Date();
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const vaccinations = HealthRepository.getByType(currentPetId, 'vaccination');
        setUpcomingVaccinations(
          vaccinations.filter(v => {
            if (!v.nextDue) return false;
            const due = new Date(v.nextDue + 'T00:00:00');
            return due >= now && due <= in30Days;
          })
        );
      } else {
        setPet(null);
        setTodayMeals([]);
        setUpcomingReminders([]);
        setUpcomingVaccinations([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activePetId, setActivePetId]);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const switchPet = useCallback((petId: string) => {
    setActivePetId(petId);
  }, [setActivePetId]);

  const navigateCreatePet = useCallback(() => {
    handleUICallback({ type: HomeScreenActionsEnum.NavigateCreatePet });
  }, [handleUICallback]);

  const navigatePetProfile = useCallback((petId: string) => {
    handleUICallback({ type: HomeScreenActionsEnum.NavigatePetProfile, payload: { petId } });
  }, [handleUICallback]);

  const navigateFeeding = useCallback(() => {
    handleUICallback({ type: HomeScreenActionsEnum.NavigateFeeding });
  }, [handleUICallback]);

  const navigateReminders = useCallback(() => {
    handleUICallback({ type: HomeScreenActionsEnum.NavigateReminders });
  }, [handleUICallback]);

  return {
    selectors: { pet, allPets, todayMeals, upcomingReminders, upcomingVaccinations, isLoading },
    handlers: { switchPet, refresh: load, navigateCreatePet, navigatePetProfile, navigateFeeding, navigateReminders },
  };
};
