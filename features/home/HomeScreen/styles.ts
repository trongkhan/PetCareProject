import { createStyles } from '@/utils/createStyles';
import { Spacing } from '@/constants/theme';

export const useStyles = createStyles((_theme) => ({
  center: { justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xl },
  sections: { gap: Spacing.sm },
  sectionsLabel: { letterSpacing: 0.8, marginBottom: Spacing.xs },
  sectionCard: { marginBottom: 0 },
  sectionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  sectionCardLeft: { flex: 1, gap: Spacing.xs },
  sectionCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  sectionCardBody: { paddingLeft: 26 },
  fab: { position: 'absolute', right: Spacing.lg, bottom: Spacing.lg },
}));
