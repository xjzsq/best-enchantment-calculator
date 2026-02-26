import { createContext } from 'react';
import { translations } from './translations';
import type { Locale, Translations } from './translations';

export type { Locale, Translations };

export interface LocaleContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

export const LocaleContext = createContext<LocaleContextType>({
  locale: 'zh',
  setLocale: () => {},
  t: translations.zh,
});
