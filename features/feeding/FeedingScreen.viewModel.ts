import { useState, useEffect, useCallback } from 'react';
import { Meal, CreateMealInput } from '@/models/types/Meal';
import { MealRepository } from '@/models/repositories/MealRepository';
import { useActivePetStore } from '@/store/activePetStore';
import { IFeedingScreenUICallback } from './FeedingScreen.types';

interface UseViewModelProps {
  handleUICallback: (action: IFeedingScreenUICallback) => void;
}

interface Selectors {
  meals: Meal[];
  todayMeals: Meal[];
  isLoading: boolean;
}

interface Handlers {
  logMeal: (input: Omit<CreateMealInput, 'petId'>) => void;
  deleteMeal: (id: string) => void;
  refresh: () => void;
}

export const useViewModel = ({ handleUICallback: _handleUICallback }: UseViewModelProps): { selectors: Selectors; handlers: Handlers } => {
  const { activePetId } = useActivePetStore();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    if (!activePetId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      setMeals(MealRepository.getByPetId(activePetId));
      setTodayMeals(MealRepository.getTodayByPetId(activePetId));
    } finally {
      setIsLoading(false);
    }
  }, [activePetId]);

  useEffect(() => { load(); }, [load]);

  const logMeal = useCallback((input: Omit<CreateMealInput, 'petId'>) => {
    if (!activePetId) return;
    const saved = MealRepository.create({ ...input, petId: activePetId });
    setMeals(prev => [saved, ...prev]);
    setTodayMeals(prev => [saved, ...prev]);
  }, [activePetId]);

  const deleteMeal = useCallback((id: string) => {
    MealRepository.delete(id);
    setMeals(prev => prev.filter(m => m.id !== id));
    setTodayMeals(prev => prev.filter(m => m.id !== id));
  }, []);

  return {
    selectors: { meals, todayMeals, isLoading },
    handlers: { logMeal, deleteMeal, refresh: load },
  };
};
