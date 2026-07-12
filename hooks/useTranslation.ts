import { lookup, type Language, type TParams } from '@/utils/i18n';
import { useCallback } from 'react';
import { useSettingsStore } from '@/store/settingsStore';

export type { Language };

/**
 * Non-hook translation for use outside React components (viewModels,
 * uiCallbacks, Alert handlers). Reads the current language from the store.
 * Usage: translate('pets.deleteConfirm', { name })
 */
export function translate(key: string, params?: TParams): string {
  return lookup(useSettingsStore.getState().language, key, params);
}

/**
 * Lightweight i18n hook backed by the language stored in settingsStore.
 * Usage: const { t } = useTranslation(); t('home.feeding.count', { count: 3 })
 * Falls back to English, then to the raw key if a translation is missing.
 */
export function useTranslation() {
  const language = useSettingsStore((s) => s.language);

  const t = useCallback(
    (key: string, params?: TParams): string => lookup(language, key, params),
    [language],
  );

  return { t, language };
}
