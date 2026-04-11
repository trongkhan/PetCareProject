export type PetSpecies = 'dog' | 'cat' | 'bird' | 'hamster' | 'fish' | 'rabbit' | 'other';
export type PetGender = 'male' | 'female';

export interface Pet {
  id: string;
  name: string;
  photo?: string;
  species: PetSpecies;
  breed: string;
  birthday?: string; // ISO date string
  adoptedDate?: string; // ISO date string
  gender: PetGender;
  weight: number; // kg
  microchip?: string;
  allergies: string[];
  notes: string;
  createdAt: string; // ISO date string
}

export interface CreatePetInput {
  name: string;
  photo?: string;
  species: PetSpecies;
  breed: string;
  birthday?: string;
  adoptedDate?: string;
  gender: PetGender;
  weight: number;
  microchip?: string;
  allergies?: string[];
  notes?: string;
}
