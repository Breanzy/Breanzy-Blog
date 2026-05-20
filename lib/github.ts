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

// README structure:
//   - 🌱 Currently Developing:
//     - ProjectName (description)
//   - 🎓 Currently Learning:
//     - Topic
//
// Items are plain indented bullets — NOT bold — so we match the text
// before the first "(" or end-of-line.

function extractSection(markdown: string, heading: string): string {
    // Capture everything after "heading:" until the next unindented "- " bullet
    const re = new RegExp(`${heading}:[\\s\\S]*?(?=\\n- |$)`, "i");
    return markdown.match(re)?.[0] ?? "";
}

function parseCurrentItems(markdown: string): string[] {
    // "Currently Developing" → "building <project>"
    const devSection = extractSection(markdown, "Currently Developing");
    const devItems = [...devSection.matchAll(/^\s{2,}-\s+(.+)/gm)]
        .map((m) => {
            const raw = m[1].trim();
            // Strip trailing "(description)" so we just get the project name
            const name = raw.replace(/\s*\(.*$/, "").trim().toLowerCase();
            return name ? `building ${name}` : "";
        })
        .filter(Boolean);

    // "Currently Learning" → "learning <topic>"
    const learnSection = extractSection(markdown, "Currently Learning");
    const learnItems = [...learnSection.matchAll(/^\s{2,}-\s+(.+)/gm)]
        .map((m) => `learning ${m[1].trim().toLowerCase()}`)
        .filter((s) => s.length > 10)
        .slice(0, 2);

    return [...devItems, ...learnItems];
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
