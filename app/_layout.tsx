import { Baloo2_400Regular, Baloo2_500Medium, Baloo2_600SemiBold, Baloo2_700Bold, Baloo2_800ExtraBold, useFonts } from '@expo-google-fonts/baloo-2';
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
  const [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });
  const colorScheme = useSettingsStore((s) => s.colorScheme);
  const systemScheme = useColorScheme();

  const isDark = resolveIsDark(colorScheme, systemScheme);

  const appTheme = useMemo(() => buildPaperTheme(isDark), [isDark]);
  const bg = appTheme.colors.background;
  const bgStyle = useMemo(() => ({ backgroundColor: bg }), [bg]);
  const screenOptions = useMemo(
    () => ({ headerShown: false, contentStyle: bgStyle }),
    [bgStyle],
  );

  const initAuth = useAuthStore((s) => s.init);
  const session = useAuthStore((s) => s.session);
  const initializing = useAuthStore((s) => s.initializing);
  const router = useRouter();
  const segments = useSegments();
  const navState = useRootNavigationState();

  const [splashVisible, setSplashVisible] = useState(true);
  // Starts fully OPAQUE, not transparent: this overlay is what's on screen
  // for every frame before fonts finish loading, standing in for the native
  // splash the instant it's gone. A transparent start (fading IN from 0) bet
  // everything on the native splash still covering the screen for that whole
  // fade — the moment it didn't (it can hide earlier than our JS timing
  // assumes), Home painted straight through the invisible overlay. Only the
  // hand-off OUT at the end still needs to fade.
  const splashFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    NotificationService.requestPermissions();
    initAuth();
  }, [initAuth]);

  // Native (cream) splash → in-app splash (already fully opaque) → hold →
  // fade it OUT. Held until Baloo 2 is loaded so headings never flash in the
  // system font.
  useEffect(() => {
    if (!fontsLoaded) return;
    SplashScreen.hideAsync().catch(() => {});
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
    <SafeAreaProvider style={bgStyle}>
      <PaperProvider theme={appTheme}>
        <Stack screenOptions={screenOptions}>
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
          <View style={[StyleSheet.absoluteFill, styles.overlay, bgStyle]}>
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
