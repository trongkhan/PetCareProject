import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { buildPaperTheme } from '@/constants/petThemes';
import { useActivePetStore } from '@/store/activePetStore';
import '@/models/db/client';
import { NotificationService } from '@/services/NotificationService';

const BG = '#FFFBF5';

export default function RootLayout() {
  const { activePetTheme } = useActivePetStore();
  const appTheme = useMemo(() => buildPaperTheme(activePetTheme), [activePetTheme]);

  useEffect(() => {
    NotificationService.requestPermissions();
  }, []);

  return (
    <SafeAreaProvider style={{ backgroundColor: BG }}>
      <PaperProvider theme={appTheme}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: BG } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="feeding" />
          <Stack.Screen name="health" />
          <Stack.Screen name="reminders" />
          <Stack.Screen name="pet/create" options={{ presentation: 'modal' }} />
          <Stack.Screen name="pet/[id]" />
          <Stack.Screen name="pet/edit" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="dark" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
