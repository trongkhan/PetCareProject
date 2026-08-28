import { Fonts, Radius, Spacing } from '@/constants/theme';
import { createStyles } from '@/utils/createStyles';

export const useStyles = createStyles((theme) => ({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.xl,
  },

  // Brand block
  brand: { alignItems: 'center', gap: Spacing.xs },
  logo: { width: 96, height: 96, borderRadius: Radius.xl },
  appName: {
    fontFamily: Fonts.headingExtraBold,
    color: theme.colors.primary,
    // Nunito already carries the weight; MD3's displaySmall fontWeight
    // fights the custom family on Android, so it's overridden to 'normal'.
    fontWeight: 'normal' as const,
  },

  // Sign-in options — one pill button per provider, plus the guest shortcut
  options: { gap: Spacing.md },

  // Reserved height so an appearing error never shifts the buttons.
  feedbackSlot: { minHeight: 24, justifyContent: 'center' },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  feedbackText: { flex: 1 },
  errorText: { color: theme.colors.error },

  providerButton: { borderRadius: Radius.full },
  providerContent: { height: 52 },
  providerLabel: { fontFamily: Fonts.headingBold, fontSize: 16 },

  apple: {
    backgroundColor: '#000000',
    // Matches shadow treatment on the other CTAs, tuned dark since the fill
    // is already black.
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  appleLabel: { color: '#FFFFFF' },

  google: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outline,
  },
  googleLabel: { color: theme.colors.onSurface },

  // Divider between provider buttons and the guest shortcut
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.outlineVariant },
  dividerLabel: { color: theme.colors.onSurfaceVariant, letterSpacing: 1 },

  guest: { borderRadius: Radius.full, borderColor: theme.colors.outline },
  guestLabel: { fontFamily: Fonts.headingBold, fontSize: 15 },
}));
