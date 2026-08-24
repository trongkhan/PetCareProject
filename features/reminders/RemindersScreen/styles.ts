import { createStyles } from '@/utils/createStyles';
import { FabClearance, Spacing } from '@/constants/theme';

export const useStyles = createStyles((_theme) => ({
  center: { justifyContent: 'center', alignItems: 'center' },
  content: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: FabClearance },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  card: { marginBottom: 0 },
  disabled: { opacity: 0.5 },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardText: { flex: 1, gap: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  deleteIcon: { margin: 0 },
}));
