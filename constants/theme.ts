import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const PetTheme = {
  light: {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#0D9488',
      primaryContainer: '#CCFBF1',
      secondary: '#FB923C',
      secondaryContainer: '#FED7AA',
      tertiary: '#8B5CF6',
      tertiaryContainer: '#EDE9FE',
      surface: '#FFFFFF',
      surfaceVariant: '#F0FDFA',
      background: '#FFFBF5',
      error: '#B00020',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#134E4A',
      onSecondary: '#FFFFFF',
      onSecondaryContainer: '#7C2D12',
      onTertiary: '#FFFFFF',
      onTertiaryContainer: '#4C1D95',
      onSurface: '#1C1B1F',
      onSurfaceVariant: '#49454F',
      outline: '#79747E',
      outlineVariant: '#CAC4D0',
    },
  },
  dark: {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: '#2DD4BF',
      primaryContainer: '#134E4A',
      secondary: '#FDBA74',
      secondaryContainer: '#9A3412',
      tertiary: '#A78BFA',
      tertiaryContainer: '#4C1D95',
      surface: '#1C1B1F',
      surfaceVariant: '#1A3330',
      background: '#141218',
      error: '#CF6679',
      onPrimary: '#003733',
      onPrimaryContainer: '#CCFBF1',
      onSecondary: '#431407',
      onSecondaryContainer: '#FED7AA',
      onTertiary: '#2E1065',
      onTertiaryContainer: '#EDE9FE',
      onSurface: '#E6E1E5',
      onSurfaceVariant: '#CAC4D0',
      outline: '#938F99',
      outlineVariant: '#49454F',
    },
  },
};

// Baloo 2, loaded in app/_layout.tsx — a rounded, friendly display face for
// headings/CTAs, distinct from the system font used everywhere else so body
// text stays quick to read.
export const Fonts = {
  bodyRegular: 'Baloo2_400Regular',
  bodyMedium: 'Baloo2_500Medium',
  headingSemiBold: 'Baloo2_600SemiBold',
  headingBold: 'Baloo2_700Bold',
  headingExtraBold: 'Baloo2_800ExtraBold',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

/**
 * The bottom tab bar (app/(tabs)/_layout.tsx) floats as a pill above the
 * screen edge — like a card, not glued to the bottom — instead of the usual
 * edge-to-edge Material bar. Height + the gap it floats above the safe-area
 * edge, shared with BaseScreen so the Home FAB clears it.
 */
export const TabBar = {
  height: 64,
  floatGap: Spacing.sm,
};

/**
 * How far the FAB sits above the screen's bottom safe-area edge. Cleared to
 * float above the tab bar pill (only Home renders both at once, but the FAB
 * is centralized in BaseScreen for every screen that uses it — see there).
 */
export const FabBottomOffset = TabBar.floatGap + TabBar.height + Spacing.xl;

/**
 * Vertical space a scrolling screen must reserve at the bottom so the
 * floating action button (56dp tall, offset FabBottomOffset from the edge)
 * can never cover the last row of content.
 */
export const FabClearance = FabBottomOffset + 56 + Spacing.md;

/**
 * Bottom clearance for tab screens with no FAB (Assistant, Account). Needed
 * because the floating tab bar is `position: 'absolute'` — React Navigation
 * only auto-reserves this space for an edge-to-edge bar, not a floating one.
 */
export const TabBarClearance = TabBar.floatGap + TabBar.height + Spacing.md;
