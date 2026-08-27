import { createStyles } from '@/utils/createStyles';
import { Spacing } from '@/constants/theme';

export const useStyles = createStyles((theme) => ({
  center: { justifyContent: 'center', alignItems: 'center', gap: Spacing.sm },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xxl },
  heroCard: {},
  heroContent: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  petName: { fontWeight: '700' },
  allergyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  allergyChip: { backgroundColor: theme.colors.warningSurface },
  allergyChipText: { color: theme.colors.warning, fontSize: 11 },
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
