import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { buildPaperTheme } from '@/constants/petThemes';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useActivePetStore } from '@/store/activePetStore';
import { useSettingsStore } from '@/store/settingsStore';
import { resolveIsDark } from '@/utils/theme';
import '@/models/db/client';
import { NotificationService } from '@/services/NotificationService';

export default function RootLayout() {
  const { activePetTheme } = useActivePetStore();
  const colorScheme = useSettingsStore((s) => s.colorScheme);
  const systemScheme = useColorScheme();

  const isDark = resolveIsDark(colorScheme, systemScheme);

  const appTheme = useMemo(
    () => buildPaperTheme(activePetTheme, isDark),
    [activePetTheme, isDark],
  );
  const bg = appTheme.colors.background;

  useEffect(() => {
    NotificationService.requestPermissions();
  }, []);

  return (
    <SafeAreaProvider style={{ backgroundColor: bg }}>
      <PaperProvider theme={appTheme}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: bg } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="feeding" />
          <Stack.Screen name="health" />
          <Stack.Screen name="reminders" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="pet/create" options={{ presentation: 'modal' }} />
          <Stack.Screen name="pet/[id]" />
          <Stack.Screen name="pet/edit" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
