import { Spacing } from '@/constants/theme';
import { createStyles } from '@/utils/createStyles';

export const useStyles = createStyles((_theme) => ({
  content: { paddingBottom: Spacing.xl },
  section: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  segmented: { marginTop: Spacing.xs },
}));
