import sanitizeHtml from "sanitize-html";

const allowedTags = [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "s",
    "u",
    "blockquote",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "pre",
    "code",
    "a",
];

/* Sanitizes rich text HTML from the editor before storage, rendering, or email delivery. */
export function sanitizeRichHtml(html: unknown) {
    if (typeof html !== "string") return "";
    return sanitizeHtml(html, {
        allowedTags,
        allowedAttributes: {
            a: ["href", "target", "rel", "class"],
            code: ["class"],
            pre: ["class"],
        },
        allowedSchemes: ["http", "https", "mailto"],
        transformTags: {
            a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
        },
        disallowedTagsMode: "discard",
    }).trim();
}
