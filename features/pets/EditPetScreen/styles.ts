import { createStyles } from '@/utils/createStyles';
import { Radius, Spacing } from '@/constants/theme';

export const useStyles = createStyles((theme) => ({
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.md },
  input: {},
  field: {},
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  submitArea: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  // Pill shape + colour-matched shadow, same treatment as the Auth CTAs.
  submitButton: {
    borderRadius: Radius.full,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
}));
