import { Baloo2_600SemiBold, Baloo2_700Bold, Baloo2_800ExtraBold, useFonts } from '@expo-google-fonts/baloo-2';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppSplash } from '@/components/AppSplash';
import { buildPaperTheme } from '@/constants/petThemes';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useActivePetStore } from '@/store/activePetStore';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { resolveIsDark } from '@/utils/theme';
import '@/models/db/client';
import { NotificationService } from '@/services/NotificationService';

// Keep the (plain cream) native splash until our JS renders, so it hands off to
// the in-app full-screen splash with no white flash.
SplashScreen.preventAutoHideAsync().catch(() => {});

const SPLASH_MS = 1600;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Baloo2_600SemiBold, Baloo2_700Bold, Baloo2_800ExtraBold });
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

  const [splashVisible, setSplashVisible] = useState(true);
  const splashFade = useRef(new Animated.Value(0)).current; // start transparent → fade in

  useEffect(() => {
    NotificationService.requestPermissions();
    initAuth();
  }, [initAuth]);

  // Native (cream) splash → fade the in-app splash IN → hold → fade it OUT.
  // Held until Baloo 2 is loaded so headings never flash in the system font.
  useEffect(() => {
    if (!fontsLoaded) return;
    SplashScreen.hideAsync().catch(() => {});
    Animated.timing(splashFade, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
    const timer = setTimeout(() => {
      Animated.timing(splashFade, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setSplashVisible(false));
    }, SPLASH_MS);
    return () => clearTimeout(timer);
  }, [splashFade, fontsLoaded]);

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
        {splashVisible ? (
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: splashFade }]}
            pointerEvents="none"
          >
            <AppSplash />
          </Animated.View>
        ) : null}
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  overlay: { justifyContent: 'center', alignItems: 'center' },
});
