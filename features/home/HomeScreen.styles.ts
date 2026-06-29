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
  // pet switcher
  switcherContainer: { paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  switcherRow: { paddingHorizontal: Spacing.md, gap: Spacing.lg, alignItems: 'center' },
  switcherItem: { alignItems: 'center', gap: 4, minWidth: 56 },
  avatarRing: { width: 60, height: 60, borderRadius: 30, borderWidth: 2.5, padding: 3, justifyContent: 'center', alignItems: 'center' },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 22, fontWeight: '700' },
  switcherName: { fontSize: 12, textAlign: 'center', maxWidth: 64 },
  fab: { position: 'absolute', right: Spacing.lg, bottom: Spacing.lg },
}));
