const MYMEMORY_BASE = 'https://api.mymemory.translated.net/get';

/**
 * Translate `text` from English to `targetLang` using the MyMemory API.
 * Returns the original text on any error or unexpected response.
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
    if (!text || !text.trim()) return text;
    try {
        const url = `${MYMEMORY_BASE}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
        const res = await fetch(url);
        if (!res.ok) return text;
        const json = (await res.json()) as { responseData?: { translatedText?: string } };
        const translated = json?.responseData?.translatedText;
        if (
            !translated ||
            translated === '' ||
            translated.toUpperCase().startsWith('MYMEMORY WARNING')
        ) {
            return text;
        }
        return translated;
    } catch {
        return text;
    }
}
