import { createStyles } from '@/utils/createStyles';
import { Spacing } from '@/constants/theme';

export const useStyles = createStyles((_theme) => ({
  center: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md },
  petName: { marginBottom: Spacing.xs },
  card: { gap: Spacing.sm },
  cardBody: { gap: Spacing.sm, paddingTop: Spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  code: { fontFamily: 'monospace', letterSpacing: 2 },
  url: { fontSize: 12 },
  lostRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scanItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  scanMeta: { flex: 1 },
  sectionLabel: { marginTop: Spacing.sm },
}));
