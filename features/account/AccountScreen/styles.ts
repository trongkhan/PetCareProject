import { createStyles } from '@/utils/createStyles';
import { Spacing, TabBarClearance } from '@/constants/theme';

export const useStyles = createStyles((theme) => ({
  header: { alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.lg },
  signedInAs: { color: theme.colors.onSurfaceVariant },
  email: { color: theme.colors.onSurface },
  // Bottom padding clears the floating tab bar (this screen only reserves
  // the top safe-area edge — see AccountScreen's `edges={['top']}`).
  footer: { padding: Spacing.lg, paddingBottom: TabBarClearance },
  signOut: { borderColor: theme.colors.error },
}));
