import { createStyles } from '@/utils/createStyles';
import { Spacing } from '@/constants/theme';

export const useStyles = createStyles((_theme) => ({
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.md },
  input: {},
  field: {},
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  submitArea: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  submitButton: { borderRadius: 8 },
}));
