import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { mix } from '@/utils/color';
import { SEMANTIC_DARK, SEMANTIC_LIGHT, type AppTheme } from './colors';
import { Fonts, Radius } from './theme';

type AppFonts = AppTheme['fonts'];
type AppFont = AppFonts['displayLarge'];

// One shared corner radius for a softer, consistent look across the app
// (drives Paper's `roundness`: inputs, cards, buttons, chips, dialogs, menus).
// Generous on purpose — closer to a pill than MD3's default 4, for the
// friendlier "pet app" look.
const APP_ROUNDNESS = Radius.xl;

// Baloo 2 (loaded in app/_layout.tsx) applied to every heading/title/button
// tier — display/headline/title all the way down to titleSmall, plus
// labelLarge (what Paper's <Button> label renders as). Only body copy
// (bodyLarge/Medium/Small) and the small labelMedium/labelSmall captions
// stay on the system font, for readability in dense text.
// MD3LightTheme.fonts is typed loosely (`Fonts`, shared with the legacy MD2
// theme) even though at runtime it's always the v3 typescale here — narrow it
// back to AppFonts so the overrides below type-check against real MD3Type
// shapes (fontSize/lineHeight/letterSpacing) instead of `any`.
const MD3_FONTS = MD3LightTheme.fonts as unknown as AppFonts;
function heading(base: AppFont, fontFamily: string): AppFont {
  return { ...base, fontFamily, fontWeight: 'normal' as const };
}
const APP_FONTS: AppFonts = {
  ...MD3_FONTS,
  displayLarge: heading(MD3_FONTS.displayLarge, Fonts.headingExtraBold),
  displayMedium: heading(MD3_FONTS.displayMedium, Fonts.headingExtraBold),
  displaySmall: heading(MD3_FONTS.displaySmall, Fonts.headingExtraBold),
  headlineLarge: heading(MD3_FONTS.headlineLarge, Fonts.headingBold),
  headlineMedium: heading(MD3_FONTS.headlineMedium, Fonts.headingBold),
  headlineSmall: heading(MD3_FONTS.headlineSmall, Fonts.headingBold),
  titleLarge: heading(MD3_FONTS.titleLarge, Fonts.headingSemiBold),
  titleMedium: heading(MD3_FONTS.titleMedium, Fonts.headingSemiBold),
  titleSmall: heading(MD3_FONTS.titleSmall, Fonts.headingSemiBold),
  labelLarge: heading(MD3_FONTS.labelLarge, Fonts.headingSemiBold),
};

export interface PetThemeConfig {
  id: string;
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
}

export const PET_THEMES: PetThemeConfig[] = [
  {
    id: 'teal',
    primary: '#0D9488',
    primaryContainer: '#CCFBF1',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#134E4A',
    secondary: '#FB923C',
    secondaryContainer: '#FED7AA',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#7C2D12',
  },
  {
    id: 'lavender',
    primary: '#7C3AED',
    primaryContainer: '#EDE9FE',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#4C1D95',
    secondary: '#EC4899',
    secondaryContainer: '#FCE7F3',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#831843',
  },
  {
    id: 'rose',
    primary: '#E11D48',
    primaryContainer: '#FFE4E6',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#9F1239',
    secondary: '#F59E0B',
    secondaryContainer: '#FEF3C7',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#78350F',
  },
  {
    id: 'ocean',
    primary: '#0369A1',
    primaryContainer: '#E0F2FE',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#0C4A6E',
    secondary: '#10B981',
    secondaryContainer: '#D1FAE5',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#064E3B',
  },
  {
    id: 'sunset',
    primary: '#EA580C',
    primaryContainer: '#FFEDD5',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#7C2D12',
    secondary: '#8B5CF6',
    secondaryContainer: '#EDE9FE',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#4C1D95',
  },
];

export const DEFAULT_PET_THEME_ID = 'teal';

export function getPetTheme(id: string): PetThemeConfig {
  return PET_THEMES.find(t => t.id === id) ?? PET_THEMES[0];
}

const DARK_BG = '#141216';
const DARK_SURFACE = '#1E1B22';

function buildLightTheme(t: PetThemeConfig): AppTheme {
  return {
    ...MD3LightTheme,
    roundness: APP_ROUNDNESS,
    fonts: APP_FONTS,
    colors: {
      ...MD3LightTheme.colors,
      ...SEMANTIC_LIGHT,
      primary: t.primary,
      primaryContainer: t.primaryContainer,
      onPrimary: t.onPrimary,
      onPrimaryContainer: t.onPrimaryContainer,
      secondary: t.secondary,
      secondaryContainer: t.secondaryContainer,
      onSecondary: t.onSecondary,
      onSecondaryContainer: t.onSecondaryContainer,
      tertiary: '#8B5CF6',
      tertiaryContainer: '#EDE9FE',
      onTertiary: '#FFFFFF',
      onTertiaryContainer: '#4C1D95',
      surface: '#FFFFFF',
      surfaceVariant: '#F5F5F5',
      background: '#FFFBF5',
      error: '#B00020',
      onSurface: '#1C1B1F',
      onSurfaceVariant: '#49454F',
      outline: '#79747E',
      outlineVariant: '#CAC4D0',
    },
  };
}

function buildDarkTheme(t: PetThemeConfig): AppTheme {
  // Lighten the pet accent a touch so it reads on a dark surface, and derive
  // dark-tinted containers by mixing the accent with the dark background.
  const accent = mix(t.primary, '#FFFFFF', 0.18);
  const secondaryAccent = mix(t.secondary, '#FFFFFF', 0.18);
  return {
    ...MD3DarkTheme,
    roundness: APP_ROUNDNESS,
    fonts: APP_FONTS,
    colors: {
      ...MD3DarkTheme.colors,
      ...SEMANTIC_DARK,
      primary: accent,
      primaryContainer: mix(t.primary, DARK_BG, 0.74),
      onPrimary: '#10121A',
      onPrimaryContainer: mix(t.primary, '#FFFFFF', 0.62),
      secondary: secondaryAccent,
      secondaryContainer: mix(t.secondary, DARK_BG, 0.74),
      onSecondary: '#10121A',
      onSecondaryContainer: mix(t.secondary, '#FFFFFF', 0.62),
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

export function buildPaperTheme(themeId: string, isDark = false): AppTheme {
  const t = getPetTheme(themeId);
  return isDark ? buildDarkTheme(t) : buildLightTheme(t);
}
