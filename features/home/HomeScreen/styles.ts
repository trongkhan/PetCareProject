import { createStyles } from '@/utils/createStyles';
import { FabClearance, Spacing } from '@/constants/theme';

export const useStyles = createStyles((theme) => ({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: FabClearance },
  sections: { gap: Spacing.sm },
  sectionsLabel: { letterSpacing: 0.8, marginBottom: Spacing.xs },
  warningText: { color: theme.colors.warning, fontWeight: '600' },
}));
