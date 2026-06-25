import { useSettings } from '@/context/SettingsContext';
import { STRINGS, Lang } from './strings';

export type { Lang } from './strings';

/**
 * Translation hook. Returns `t(key, params?)` resolving against the user's
 * language (falls back to Portuguese, then the raw key).
 */
export function useT() {
  const { settings } = useSettings();
  const lang: Lang = settings.language === 'en' ? 'en' : 'pt';
  return (key: string, params?: Record<string, string | number>): string => {
    let s = STRINGS[lang][key] ?? STRINGS.pt[key] ?? key;
    if (params) {
      for (const k of Object.keys(params)) s = s.replace(`{${k}}`, String(params[k]));
    }
    return s;
  };
}
