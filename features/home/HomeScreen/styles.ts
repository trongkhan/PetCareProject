import { createStyles } from '@/utils/createStyles';
import { Spacing } from '@/constants/theme';

export const useStyles = createStyles((_theme) => ({
  center: { justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.xl },
  section: { gap: Spacing.sm },
  card: { marginBottom: 0 },
  fab: { position: 'absolute', right: Spacing.lg, bottom: Spacing.lg },
}));
