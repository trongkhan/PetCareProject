import type { Language } from './i18n';

/** BCP-47 locale tag for the app language. */
export function localeTag(language: Language): string {
  return language === 'vi' ? 'vi-VN' : 'en-US';
}

/**
 * Format a date for display in the given language. Accepts a Date, a
 * timestamp, or a date string; bare `YYYY-MM-DD` strings are treated as
 * local midnight to avoid timezone drift. Pure logic — no rendering.
 */
export function formatDate(input: string | number | Date, language: Language): string {
  const d =
    input instanceof Date
      ? input
      : typeof input === 'string' && input.length <= 10
        ? new Date(input + 'T00:00:00')
        : new Date(input);
  return d.toLocaleDateString(localeTag(language));
}

/** Format a number with locale-aware grouping. */
export function formatNumber(value: number, language: Language): string {
  return value.toLocaleString(localeTag(language));
}

/**
 * Format a VND amount with locale-aware grouping and symbol placement
 * (e.g. "150.000 ₫" in vi, "₫150,000" in en). Falls back to a manual
 * suffix if the runtime's Intl lacks currency support.
 */
export function formatCurrency(amount: number, language: Language): string {
  try {
    return new Intl.NumberFormat(localeTag(language), {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${formatNumber(amount, language)} ₫`;
  }
}
