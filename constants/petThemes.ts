import { mix } from '@/utils/color';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { SEMANTIC_DARK, SEMANTIC_LIGHT, type AppTheme } from './colors';
import { Fonts, Radius } from './theme';

type AppFonts = AppTheme['fonts'];
type AppFont = AppFonts['displayLarge'];

const APP_ROUNDNESS = Radius.xl;

const MD3_FONTS = MD3LightTheme.fonts as unknown as AppFonts;
function withFamily(base: AppFont, fontFamily: string): AppFont {
  return { ...base, fontFamily, fontWeight: 'normal' as const };
}
const APP_FONTS: AppFonts = {
  ...MD3_FONTS,
  displayLarge: withFamily(MD3_FONTS.displayLarge, Fonts.headingExtraBold),
  displayMedium: withFamily(MD3_FONTS.displayMedium, Fonts.headingExtraBold),
  displaySmall: withFamily(MD3_FONTS.displaySmall, Fonts.headingExtraBold),
  headlineLarge: withFamily(MD3_FONTS.headlineLarge, Fonts.headingBold),
  headlineMedium: withFamily(MD3_FONTS.headlineMedium, Fonts.headingBold),
  headlineSmall: withFamily(MD3_FONTS.headlineSmall, Fonts.headingBold),
  titleLarge: withFamily(MD3_FONTS.titleLarge, Fonts.headingSemiBold),
  titleMedium: withFamily(MD3_FONTS.titleMedium, Fonts.headingSemiBold),
  titleSmall: withFamily(MD3_FONTS.titleSmall, Fonts.headingSemiBold),
  labelLarge: withFamily(MD3_FONTS.labelLarge, Fonts.headingSemiBold),
  // Body copy and the smaller labels use the same Baloo 2 family for a
  // consistent typeface app-wide, but a lighter (non-heading) cut so
  // paragraph-length text doesn't read as bold as a title.
  bodyLarge: withFamily(MD3_FONTS.bodyLarge, Fonts.bodyRegular),
  bodyMedium: withFamily(MD3_FONTS.bodyMedium, Fonts.bodyRegular),
  bodySmall: withFamily(MD3_FONTS.bodySmall, Fonts.bodyRegular),
  labelMedium: withFamily(MD3_FONTS.labelMedium, Fonts.bodyMedium),
  labelSmall: withFamily(MD3_FONTS.labelSmall, Fonts.bodyMedium),
};

// Single fixed app palette ("Grass") — the app used to let each pet pick its
// own accent color (5 presets); that picker is gone, so this is the only
// theme now. Kept as a config object (not inlined into the two builders
// below) so light/dark still share one definition of what "the app's accent"
// is.
const APP_COLORS = {
  primary: '#16A34A',
  primaryContainer: '#DCFCE7',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#14532D',
  secondary: '#FB923C',
  secondaryContainer: '#FED7AA',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#7C2D12',
};

const DARK_BG = '#141216';
const DARK_SURFACE = '#1E1B22';

function buildLightTheme(): AppTheme {
  return {
    ...MD3LightTheme,
    roundness: APP_ROUNDNESS,
    fonts: APP_FONTS,
    colors: {
      ...MD3LightTheme.colors,
      ...SEMANTIC_LIGHT,
      primary: APP_COLORS.primary,
      primaryContainer: APP_COLORS.primaryContainer,
      onPrimary: APP_COLORS.onPrimary,
      onPrimaryContainer: APP_COLORS.onPrimaryContainer,
      secondary: APP_COLORS.secondary,
      secondaryContainer: APP_COLORS.secondaryContainer,
      onSecondary: APP_COLORS.onSecondary,
      onSecondaryContainer: APP_COLORS.onSecondaryContainer,
      tertiary: '#8B5CF6',
      tertiaryContainer: '#EDE9FE',
      onTertiary: '#FFFFFF',
      onTertiaryContainer: '#4C1D95',
      surface: '#FFFFFF',
      surfaceVariant: '#F5F5F5',
      background: '#FFFFFF',
      error: '#B00020',
      onSurface: '#1C1B1F',
      // A touch darker than MD3's stock '#49454F' — this is the color most
      // body/secondary text in the app is explicitly set to, so lightening
      // it there reads as "default text" being too thin.
      onSurfaceVariant: '#3A3640',
      outline: '#79747E',
      outlineVariant: '#CAC4D0',
    },
  };
}

function buildDarkTheme(): AppTheme {
  const accent = mix(APP_COLORS.primary, '#FFFFFF', 0.18);
  const secondaryAccent = mix(APP_COLORS.secondary, '#FFFFFF', 0.18);
  return {
    ...MD3DarkTheme,
    roundness: APP_ROUNDNESS,
    fonts: APP_FONTS,
    colors: {
      ...MD3DarkTheme.colors,
      ...SEMANTIC_DARK,
      primary: accent,
      primaryContainer: mix(APP_COLORS.primary, DARK_BG, 0.74),
      onPrimary: '#10121A',
      onPrimaryContainer: mix(APP_COLORS.primary, '#FFFFFF', 0.62),
      secondary: secondaryAccent,
      secondaryContainer: mix(APP_COLORS.secondary, DARK_BG, 0.74),
      onSecondary: '#10121A',
      onSecondaryContainer: mix(APP_COLORS.secondary, '#FFFFFF', 0.62),
      tertiary: '#C4B5FD',
      tertiaryContainer: '#3B2E63',
      onTertiary: '#1E1233',
      onTertiaryContainer: '#EDE9FE',
      surface: DARK_SURFACE,
      surfaceVariant: '#2A2731',
      background: DARK_BG,
      error: '#F2B8B5',
      onSurface: '#ECE9EF',
      onSurfaceVariant: '#C9C4D0',
      outline: '#948F9C',
      outlineVariant: '#403C47',
    },
  };
}

export function buildPaperTheme(isDark = false): AppTheme {
  return isDark ? buildDarkTheme() : buildLightTheme();
}
