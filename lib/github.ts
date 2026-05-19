/**
 * Fetches the Breanzy GitHub profile README and parses the
 * "Currently Developing" and "Currently Learning" bullet items
 * so they can rotate in the hero status pill.
 *
 * Returns an empty array on any failure — the pill falls back to
 * a hardcoded string in that case.
 */

const README_URL =
    "https://raw.githubusercontent.com/Breanzy/Breanzy/main/README.md";

const CACHE_TTL_SECONDS = 3600; // re-fetch from GitHub once per hour

let cachedAt = 0;
let cachedTexts: string[] = [];

function parseCurrentItems(markdown: string): string[] {
    const results: string[] = [];

    // Match "Currently Developing" section — grab bold project names
    const devSection = markdown.match(
        /currently developing[:\s\S]*?(?=\n#{2}|$)/i
    )?.[0] ?? "";
    const devItems = [...devSection.matchAll(/\*\*([^*]+)\*\*/g)].map(
        (m) => `building ${m[1].trim().toLowerCase()}`
    );

    // Match "Currently Learning" section — grab first-level bullet content
    const learnSection = markdown.match(
        /currently learning[:\s\S]*?(?=\n#{2}|$)/i
    )?.[0] ?? "";
    const learnItems = [...learnSection.matchAll(/[-*]\s+([^\n*[]+)/g)]
        .map((m) => `learning ${m[1].trim().toLowerCase().replace(/\(.*?\)/g, "").trim()}`)
        .filter((s) => s.length > 10)
        .slice(0, 2);

    results.push(...devItems, ...learnItems);
    return results.filter(Boolean);
}

export async function getCurrentStatusTexts(): Promise<string[]> {
    const now = Date.now() / 1000;
    if (cachedTexts.length && now - cachedAt < CACHE_TTL_SECONDS) {
        return cachedTexts;
    }

    try {
        const res = await fetch(README_URL, {
            next: { revalidate: CACHE_TTL_SECONDS },
        });
        if (!res.ok) throw new Error(`GitHub README fetch failed: ${res.status}`);
        const text = await res.text();
        const parsed = parseCurrentItems(text);
        if (parsed.length) {
            cachedTexts = parsed;
            cachedAt = now;
            return parsed;
        }
    } catch {
        // silently fall back
    }

    return [];
}
