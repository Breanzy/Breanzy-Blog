import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import Project from "@/models/project.model";

const BASE = process.env.SITE_URL ?? "https://breanzy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    await connectDB();

    const [posts, projects] = await Promise.all([
        Post.find({}, "slug updatedAt").lean() as Promise<any[]>,
        Project.find({}, "slug updatedAt").lean() as Promise<any[]>,
    ]);

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${BASE}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE}/resume`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ];

    const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
        url: `${BASE}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
        url: `${BASE}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
