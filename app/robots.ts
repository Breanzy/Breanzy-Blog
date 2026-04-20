import type { MetadataRoute } from "next";

const BASE = process.env.SITE_URL ?? "https://breanzy.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/api/",
                "/dashboard",
                "/dashboard/",
                "/create-post",
                "/update-post/",
                "/sign-in",
                "/sign-up",
                "/search",
            ],
        },
        sitemap: `${BASE}/sitemap.xml`,
    };
}
