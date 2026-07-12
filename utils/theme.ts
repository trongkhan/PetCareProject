export type ColorSchemePreference = 'light' | 'dark' | 'system';

/**
 * Resolve whether dark mode is active given the user's preference and the
 * OS-level scheme. Pure logic — no React / rendering.
 */
export function resolveIsDark(
  preference: ColorSchemePreference,
  systemScheme: 'light' | 'dark' | null | undefined,
): boolean {
  return preference === 'system' ? systemScheme === 'dark' : preference === 'dark';
}
