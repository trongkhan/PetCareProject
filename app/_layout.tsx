import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PetTheme } from '@/constants/theme';
import '@/models/db/client';
import { NotificationService } from '@/services/NotificationService';

export default function RootLayout() {
  useEffect(() => {
    NotificationService.requestPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={PetTheme.light}>
        <Stack screenOptions={{ headerShown: false }}>
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
