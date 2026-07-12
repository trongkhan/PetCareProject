import { Spacing } from '@/constants/theme';
import { createStyles } from '@/utils/createStyles';

export const useStyles = createStyles((theme) => ({
  card: { backgroundColor: theme.colors.warningSurface },
  content: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  emoji: { fontSize: 20 },
  body: { flex: 1 },
  title: { color: theme.colors.warning, fontWeight: '700' },
  item: { color: theme.colors.warningStrong, marginTop: 2 },
}));
