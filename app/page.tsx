import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import Project from "@/models/project.model";
import { getCurrentStatusTexts } from "@/lib/github";
import HomeClient from "./HomeClient";
import { PersonSchema, WebSiteSchema } from "@/components/JsonLd";

const getHomeData = unstable_cache(
    async () => {
        await connectDB();
        const [postsRaw, projectsRaw] = await Promise.all([
            Post.find().sort({ createdAt: -1 }).limit(4).select("title slug image category content createdAt").lean(),
            Project.find({ featured: true }).limit(4).lean(),
        ]);
        return {
            posts: JSON.parse(JSON.stringify(postsRaw)),
            projects: JSON.parse(JSON.stringify(projectsRaw)),
        };
    },
    ["home"],
    { tags: ["posts", "projects"], revalidate: false }
);

export default async function HomePage() {
    const [{ posts, projects }, statusTexts] = await Promise.all([
        getHomeData(),
        getCurrentStatusTexts(),
    ]);

    return (
        <>
            <PersonSchema />
            <WebSiteSchema />
            <HomeClient posts={posts} projects={projects} statusTexts={statusTexts} />
        </>
    );
}
