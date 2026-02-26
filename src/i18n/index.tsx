import { useState } from 'react';
import type React from 'react';
import { LocaleContext } from './context';
import { translations } from './translations';
import type { Locale } from './translations';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('zh');
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}
