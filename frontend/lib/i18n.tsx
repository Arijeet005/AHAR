'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type AppLang = 'en' | 'hi' | 'mr' | 'gu' | 'bn' | 'ta' | 'te' | 'kn' | 'ml';

export const SUPPORTED_LANGS: { value: AppLang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'mr', label: 'मराठी' },
  { value: 'gu', label: 'ગુજરાતી' },
  { value: 'bn', label: 'বাংলা' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
  { value: 'ml', label: 'മലയാളം' },
];

const VALID_LANGS: AppLang[] = ['en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te', 'kn', 'ml'];

type I18nContextValue = {
  lang: AppLang;
  setLang: (lang: AppLang) => void;
  t: (key: keyof typeof EN_STRINGS) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'ahar-lang';

// English source labels. Translation to selected language is handled by useTranslate + API.
const EN_STRINGS = {
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
} as const;

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AppLang>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as AppLang | null;
    if (stored && VALID_LANGS.includes(stored)) setLangState(stored);
  }, []);

  const setLang = useCallback((next: AppLang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback((key: keyof typeof EN_STRINGS) => EN_STRINGS[key], []);

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

