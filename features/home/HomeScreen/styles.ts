import { createStyles } from '@/utils/createStyles';
import { Spacing } from '@/constants/theme';

export const useStyles = createStyles((theme) => ({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  content: { padding: Spacing.md, gap: Spacing.md },
  sections: { gap: Spacing.sm },
  sectionsLabel: { letterSpacing: 0.8, marginBottom: Spacing.xs },
  warningText: { color: theme.colors.warning, fontWeight: '600' },
  emptyItalic: { fontStyle: 'italic' },
  tightGap: { gap: 2 },
  countLabel: { fontWeight: '600' },
  noPetTitle: { marginBottom: Spacing.sm },
  noPetSubtitle: { marginBottom: Spacing.lg },
}));
