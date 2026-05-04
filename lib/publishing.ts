import { NextRequest } from "next/server";
import Post from "@/models/post.model";
import Project from "@/models/project.model";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";
import { ensureSlug, slugifyTitle } from "@/lib/slug";
import { optionalString, readJsonObject, requiredString } from "@/lib/validation";

type PostWritePayload = {
    title: string;
    content: string;
    category: string;
    image?: string;
};

type ProjectWritePayload = {
    title: string;
    description: string;
    content: string;
    image: string;
    techStack: string[];
    liveUrl: string;
    repoUrl: string;
    featured: boolean;
    category: string;
};

/* Reads and normalizes post publishing input from a route request. */
export async function readPostWritePayload(request: NextRequest): Promise<PostWritePayload> {
    const body = await readJsonObject(request);
    const title = requiredString(body, "title", 180);
    const content = sanitizeRichHtml(requiredString(body, "content", 250000));
    if (!content) {
        throw new Error("Content is required");
    }
    return {
        title,
        content,
        category: optionalString(body, "category", 80) || "uncategorized",
        image: optionalString(body, "image", 2000) || undefined,
    };
}

/* Reads and normalizes project publishing input from a route request. */
export async function readProjectWritePayload(request: NextRequest): Promise<ProjectWritePayload> {
    const body = await readJsonObject(request);
    return {
        title: requiredString(body, "title", 180),
        description: requiredString(body, "description", 2000),
        content: sanitizeRichHtml(optionalString(body, "content", 250000)),
        image: optionalString(body, "image", 2000),
        techStack: Array.isArray(body.techStack) ? body.techStack.filter((item) => typeof item === "string").slice(0, 20) : [],
        liveUrl: optionalString(body, "liveUrl", 2000),
        repoUrl: optionalString(body, "repoUrl", 2000),
        featured: body.featured === true,
        category: optionalString(body, "category", 80) || "uncategorized",
    };
}

/* Finds a unique post slug for a title, optionally excluding the current post. */
export async function getUniquePostSlug(title: string, currentPostId?: string) {
    return getUniqueSlug(title, (slug) => Post.exists({ slug, ...(currentPostId && { _id: { $ne: currentPostId } }) }));
}

/* Finds a unique project slug for a title, optionally excluding the current project. */
export async function getUniqueProjectSlug(title: string, currentProjectId?: string) {
    return getUniqueSlug(title, (slug) => Project.exists({ slug, ...(currentProjectId && { _id: { $ne: currentProjectId } }) }));
}

/* Probes storage for the first available slug derived from the supplied title. */
async function getUniqueSlug(title: string, exists: (slug: string) => Promise<unknown>) {
    const baseSlug = ensureSlug(slugifyTitle(title));
    let slug = baseSlug;
    let suffix = 2;
    while (await exists(slug)) {
        slug = `${baseSlug}-${suffix++}`;
    }
    return slug;
}
