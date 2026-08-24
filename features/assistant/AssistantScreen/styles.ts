import { createStyles } from '@/utils/createStyles';
import { Spacing, TabBarClearance } from '@/constants/theme';

export const useStyles = createStyles((theme) => ({
  flex: { flex: 1 },
  list: { padding: Spacing.md, gap: Spacing.sm },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  bubble: { maxWidth: '85%', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 16 },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: theme.colors.primary },
  bubbleAssistant: { alignSelf: 'flex-start', backgroundColor: theme.colors.surfaceVariant },
  bubbleTextUser: { color: theme.colors.onPrimary },
  bubbleTextAssistant: { color: theme.colors.onSurface },
  loading: { marginVertical: Spacing.xs },
  disclaimer: { textAlign: 'center', paddingHorizontal: Spacing.md, color: theme.colors.onSurfaceVariant },
  // Bottom padding clears the floating tab bar (this screen only reserves
  // the top safe-area edge — see AssistantScreen's `edges={['top']}`).
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
    paddingBottom: TabBarClearance,
  },
}));
