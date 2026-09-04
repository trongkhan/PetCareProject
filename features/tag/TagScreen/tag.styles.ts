import { createStyles } from '@/utils/createStyles';
import { Spacing } from '@/constants/theme';

export const useStyles = createStyles((_theme) => ({
  center: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  content: { padding: Spacing.md, gap: Spacing.md },
  petName: { marginBottom: Spacing.xs },

  // Plain View styled as a card (not Paper's Card) so padding reliably contains
  // the content — Card.Content's vertical padding was letting the header/footer
  // spill past the rounded border. borderColor/backgroundColor set from theme.
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.md,
    gap: Spacing.md,
  },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  codeBlock: { flex: 1 },
  codeCaption: { textTransform: 'uppercase', letterSpacing: 1 },
  code: { fontFamily: 'monospace', letterSpacing: 2, fontWeight: '700' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  deleteBtn: { margin: 0 },

  qrWrap: { alignItems: 'center', gap: Spacing.xs },
  qrBox: { backgroundColor: '#ffffff', padding: Spacing.sm, borderRadius: 12 },

  urlGroup: { gap: Spacing.xs },
  urlBox: { borderRadius: 10, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm },
  url: { lineHeight: 18 },
  urlActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },

  map: { height: 180, borderRadius: 12, overflow: 'hidden' },

  lostRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  group: { gap: Spacing.sm },
  saveBtn: { alignSelf: 'flex-start' },

  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  scanMeta: { flex: 1 },
}));
