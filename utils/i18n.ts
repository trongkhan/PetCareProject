import en from '@/locales/en.json';
import vi from '@/locales/vi.json';

/**
 * Pure i18n lookup logic (no React). The React-facing API lives in
 * hooks/useTranslation.ts, which is a thin wrapper over `lookup`.
 */

export type Language = 'vi' | 'en';
export type TParams = Record<string, string | number>;

const resources: Record<Language, unknown> = { en, vi };

/** Resolve a dot-notation key (e.g. "home.feeding.title") to a string. */
function resolve(source: unknown, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[part];
    return undefined;
  }, source);
  return typeof value === 'string' ? value : undefined;
}

/** Replace {{name}} placeholders with the matching param value. */
function interpolate(template: string, params?: TParams): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) =>
    params[name] != null ? String(params[name]) : `{{${name}}}`,
  );
}

/** Translate a key for a language: current language → English fallback → raw key. */
export function lookup(language: Language, key: string, params?: TParams): string {
  const template = resolve(resources[language], key) ?? resolve(resources.en, key) ?? key;
  return interpolate(template, params);
}
