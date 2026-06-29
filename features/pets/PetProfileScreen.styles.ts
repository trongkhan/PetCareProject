import { createStyles } from '@/utils/createStyles';
import { Spacing } from '@/constants/theme';

export const useStyles = createStyles((_theme) => ({
  center: { justifyContent: 'center', alignItems: 'center', gap: Spacing.sm },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },
  heroCard: {},
  heroContent: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: { flexDirection: 'row', gap: Spacing.sm },
  deleteButton: { marginTop: Spacing.md },
}));
