import { useLocalSearchParams } from 'expo-router';
import { EditPetScreen } from '@/features/pets/EditPetScreen';

export default function EditPetRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditPetScreen petId={id} />;
}
