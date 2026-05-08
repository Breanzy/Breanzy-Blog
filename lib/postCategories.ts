export const POST_CATEGORIES = [
    { value: "dev-journal", label: "Dev Journal" },
    { value: "tech-takes", label: "Tech Takes" },
    { value: "build-notes", label: "Build Notes" },
    { value: "learning-notes", label: "Learning Notes" },
    { value: "career-growth", label: "Career Growth" },
    { value: "random-tangents", label: "Random Tangents" },
] as const;

export type PostCategoryValue = (typeof POST_CATEGORIES)[number]["value"];

// Checks whether a saved category belongs to the current blog taxonomy.
export function isKnownPostCategory(category: string) {
    return POST_CATEGORIES.some((item) => item.value === category);
}

// Returns the reader-facing label for a saved category value.
export function getPostCategoryLabel(category?: string | null) {
    if (!category || category === "uncategorized") return "Uncategorized";

    const match = POST_CATEGORIES.find((item) => item.value === category);
    if (match) return match.label;

    return category
        .split(/[-_]/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
