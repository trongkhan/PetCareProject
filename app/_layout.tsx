import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { buildPaperTheme } from '@/constants/petThemes';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useActivePetStore } from '@/store/activePetStore';
import { useAuthStore } from '@/store/authStore';
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

  const initAuth = useAuthStore((s) => s.init);
  const session = useAuthStore((s) => s.session);
  const initializing = useAuthStore((s) => s.initializing);
  const router = useRouter();
  const segments = useSegments();
  const navState = useRootNavigationState();

  useEffect(() => {
    NotificationService.requestPermissions();
    initAuth();
  }, [initAuth]);

  // Auth gate: send signed-out users to /auth, signed-in users into the app.
  // Guard on navState?.key so we never navigate before the navigator mounts.
  useEffect(() => {
    if (initializing || !navState?.key) return;
    const inAuth = segments[0] === 'auth';
    if (!session && !inAuth) router.replace('/auth');
    else if (session && inAuth) router.replace('/');
  }, [session, initializing, segments, router, navState?.key]);

  return (
    <SafeAreaProvider style={{ backgroundColor: bg }}>
      <PaperProvider theme={appTheme}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: bg } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="feeding" />
          <Stack.Screen name="health" />
          <Stack.Screen name="reminders" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="pet/create" options={{ presentation: 'modal' }} />
          <Stack.Screen name="pet/[id]" />
          <Stack.Screen name="pet/edit" options={{ presentation: 'modal' }} />
        </Stack>
        {initializing ? (
          <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: bg }]}>
            <ActivityIndicator size="large" color={appTheme.colors.primary} />
          </View>
        ) : null}
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  overlay: { justifyContent: 'center', alignItems: 'center' },
});
