import { createStyles } from '@/utils/createStyles';
import { Spacing } from '@/constants/theme';

export const useStyles = createStyles((theme) => ({
  header: { alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.lg },
  signedInAs: { color: theme.colors.onSurfaceVariant },
  email: { color: theme.colors.onSurface },
  footer: { padding: Spacing.lg },
  signOut: { borderColor: theme.colors.error },
}));
