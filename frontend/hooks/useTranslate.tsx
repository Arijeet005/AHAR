'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { translateText } from '@/lib/translationAPI';

// ── In-memory translation cache ──────────────────────────────────────────────
const memCache = new Map<string, string>();
const LS_CACHE_KEY = 'ahar-tr-cache-v1';
let cacheHydrated = false;

function hydrateCache(): void {
    if (typeof window === 'undefined' || cacheHydrated) return;
    cacheHydrated = true;
    try {
        const raw = window.localStorage.getItem(LS_CACHE_KEY);
        if (raw) {
            Object.entries(JSON.parse(raw) as Record<string, string>).forEach(([k, v]) =>
                memCache.set(k, v)
            );
        }
    } catch {
        // ignore storage errors
    }
}

function persistEntry(key: string, value: string): void {
    memCache.set(key, value);
    try {
        const snapshot: Record<string, string> = {};
        memCache.forEach((v, k) => {
            snapshot[k] = v;
        });
        window.localStorage.setItem(LS_CACHE_KEY, JSON.stringify(snapshot));
    } catch {
        // ignore storage errors
    }
}

function ck(text: string, lang: string): string {
    return `${lang}|${text}`;
}

// ── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Returns the UI string translated to the current language.
 * Immediately returns a cached value if available, otherwise falls back to
 * the original text while the MyMemory API call resolves in the background.
 */
export function useTranslate(text: string): string {
    const { lang } = useI18n();

    // Compute initial value synchronously from cache so first render is correct
    const getInitial = (): string => {
        if (lang === 'en' || !text) return text;
        hydrateCache();
        return memCache.get(ck(text, lang)) ?? text;
    };

    const [output, setOutput] = useState<string>(getInitial);

    useEffect(() => {
        hydrateCache();

        if (lang === 'en' || !text) {
            setOutput(text);
            return;
        }

        const k = ck(text, lang);
        if (memCache.has(k)) {
            setOutput(memCache.get(k)!);
            return;
        }

        let active = true;
        translateText(text, lang).then((translated) => {
            if (!active) return;
            persistEntry(k, translated);
            setOutput(translated);
        });
        return () => {
            active = false;
        };
    }, [text, lang]);

    // Serve cached value immediately (may be populated by a sibling effect)
    if (lang === 'en' || !text) return text;
    return memCache.get(ck(text, lang)) ?? output;
}

// ── Inline component ──────────────────────────────────────────────────────────
/**
 * Drop-in translation wrapper for JSX text nodes.
 *
 * Usage:  <T>Dashboard</T>
 */
export function T({ children }: { children: string }): React.ReactElement {
    const translated = useTranslate(children);
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{translated}</>;
}
