/* Creates a URL-safe slug candidate from a title. */
export function slugifyTitle(title: string) {
    return title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

/* Appends a suffix to an empty slug candidate so unique indexes still work. */
export function ensureSlug(slug: string) {
    return slug || `untitled-${Date.now()}`;
}
