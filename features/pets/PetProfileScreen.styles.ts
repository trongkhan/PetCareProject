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
  // weight chart
  chartCard: { padding: Spacing.md, gap: Spacing.sm },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartArea: { height: 100, flexDirection: 'row', alignItems: 'flex-end', gap: 6, paddingTop: Spacing.sm },
  bar: { flex: 1, borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 10, textAlign: 'center', marginTop: 2 },
  chartEmpty: { height: 80, justifyContent: 'center', alignItems: 'center' },
}));
