export function stripHtml(input: string) {
    return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function getReadingTimeMinutes(content: string) {
    const words = stripHtml(content).split(" ").filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

export function formatPostDate(value: string | Date) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}
