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
  sectionTitle: { marginTop: Spacing.md },
  card: { marginBottom: 0 },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardText: { flex: 1, gap: 2 },
  recordHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
}));
