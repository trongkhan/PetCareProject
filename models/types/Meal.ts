export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'treat';
export type MealUnit = 'grams' | 'cups' | 'ml';

export interface Meal {
  id: string;
  petId: string;
  type: MealType;
  food: string;
  amount: number;
  unit: MealUnit;
  brand?: string;
  notes?: string;
  timestamp: string; // ISO date string
}

export interface CreateMealInput {
  petId: string;
  type: MealType;
  food: string;
  amount: number;
  unit: MealUnit;
  brand?: string;
  notes?: string;
  timestamp?: string;
}

export interface FeedingSchedule {
  id: string;
  petId: string;
  type: MealType;
  time: string; // HH:mm
  enabled: boolean;
}
