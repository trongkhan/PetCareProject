/**
 * Pure color math helpers (no React / React Native dependencies).
 */

/** Clamp a number to the valid 0–255 channel range and round it. */
export function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

/** Parse a `#RRGGBB` hex string into an [r, g, b] tuple. */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Build a `#RRGGBB` hex string from r, g, b channel values. */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => clamp(c).toString(16).padStart(2, '0')).join('');
}

/** Mix color `a` toward color `b` by ratio t (0 = a, 1 = b). */
export function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}
