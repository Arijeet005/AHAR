'use client';

import { AppLang, SUPPORTED_LANGS, useI18n } from '@/lib/i18n';

export default function LanguageSwitcher() {
    const { lang, setLang, t } = useI18n();

    return (
        <select
            className="glass px-3 py-2 rounded-sm font-body text-xs text-text-primary outline-none"
            value={lang}
            onChange={(e) => setLang(e.target.value as AppLang)}
            aria-label={t('language')}
        >
            {SUPPORTED_LANGS.map((l) => (
                <option key={l.value} value={l.value}>
                    {l.label}
                </option>
            ))}
        </select>
    );
}
