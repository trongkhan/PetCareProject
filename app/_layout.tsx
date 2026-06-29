import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PetTheme } from '@/constants/theme';
import '@/models/db/client';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={PetTheme.light}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pet/create" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="pet/[id]" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
