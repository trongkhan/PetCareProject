import { createStyles } from '@/utils/createStyles';
import { Spacing } from '@/constants/theme';

export const useStyles = createStyles((_theme) => ({
  center: { justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xl },
  headerCard: { borderRadius: 16, padding: Spacing.lg, gap: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  profileLink: { alignSelf: 'flex-start', marginTop: Spacing.xs },
  section: { gap: Spacing.sm },
  card: { marginBottom: 0 },
  switcher: { paddingVertical: Spacing.xs },
  switcherRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, gap: Spacing.xs },
  fab: { position: 'absolute', right: Spacing.lg, bottom: Spacing.lg },
}));
