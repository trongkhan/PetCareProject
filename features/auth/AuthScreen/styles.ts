import { createStyles } from '@/utils/createStyles';
import { Radius, Spacing } from '@/constants/theme';

export const useStyles = createStyles((theme) => ({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.xl,
  },

  // Brand block
  brand: { alignItems: 'center', gap: Spacing.sm },
  logo: { width: 96, height: 96, borderRadius: Radius.xl },
  appName: { color: theme.colors.primary, fontWeight: '800' as const },

  // Form card — a raised surface separates the form from the cream background
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: theme.colors.surface,
  },
  fields: { gap: Spacing.sm },
  input: { backgroundColor: theme.colors.surface },

  // Reserved height so an appearing error never shifts the button.
  feedbackSlot: { minHeight: 24, justifyContent: 'center' },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  feedbackText: { flex: 1 },
  errorText: { color: theme.colors.error },

  submit: { borderRadius: Radius.full },
  submitContent: { height: 52 },
}));
