import { useLocalSearchParams } from 'expo-router';
import { PetProfileScreen } from '@/features/pets/PetProfileScreen';

export default function PetProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PetProfileScreen petId={id} />;
}
