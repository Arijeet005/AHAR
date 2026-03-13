'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type AppLang = 'en' | 'hi';

type I18nContextValue = {
  lang: AppLang;
  setLang: (lang: AppLang) => void;
  t: (key: keyof typeof STRINGS.en) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'ahar-lang';

// Minimal placeholder translations (expand as you flesh out content).
const STRINGS = {
  en: {
    dashboard: 'Dashboard',
    prediction: 'Prediction',
    inventoryHub: 'Inventory Hub',
    donationLocator: 'Donation Locator',
    payment: 'Payment',
    guide: 'Guide',
    pricing: 'Pricing',
    login: 'Login',
    register: 'Register',
    theme: 'Theme',
    language: 'Language',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    prediction: 'पूर्वानुमान',
    inventoryHub: 'इन्वेंटरी',
    donationLocator: 'दान लोकेटर',
    payment: 'भुगतान',
    guide: 'गाइड',
    pricing: 'प्राइसिंग',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    theme: 'थीम',
    language: 'भाषा',
  },
} as const;

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AppLang>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as AppLang | null;
    if (stored === 'en' || stored === 'hi') setLangState(stored);
  }, []);

  const setLang = useCallback((next: AppLang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback((key: keyof typeof STRINGS.en) => STRINGS[lang][key], [lang]);

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

