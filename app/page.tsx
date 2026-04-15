import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import Project from "@/models/project.model";
import HomeClient from "./HomeClient";

const getHomeData = unstable_cache(
    async () => {
        await connectDB();
        const [postsRaw, projectsRaw] = await Promise.all([
            Post.find().sort({ updatedAt: -1 }).limit(3).select("-content").lean(),
            Project.find({ featured: true }).limit(3).lean(),
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
    const { posts, projects } = await getHomeData();
    return <HomeClient posts={posts} projects={projects} />;
}
