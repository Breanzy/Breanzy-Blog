import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import PostCard from "@/components/PostCard";
import CallToAction from "@/components/CallToAction";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
import FadeIn from "@/components/FadeIn";
import ParallaxHero from "@/components/ParallaxHero";

export const metadata: Metadata = {
    title: "Blog",
    description: "Thoughts, tutorials, and write-ups on web development, full-stack projects, and everything in between.",
};

const getPosts = unstable_cache(
    async () => {
        await connectDB();
        const posts = await Post.find().sort({ updatedAt: -1 }).select("-content").lean();
        return JSON.parse(JSON.stringify(posts));
    },
    ["blog-list"],
    { tags: ["posts"], revalidate: false }
);

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <div className="min-h-screen">
            <ParallaxHero
                title="Blog"
                subtitle="Thoughts, tutorials, and write-ups on web development, full-stack projects, and everything in between."
            >
                <Link href="/search" className="inline-block mt-4 text-sm text-blue-500 hover:text-blue-400 transition-colors">
                    Browse all posts →
                </Link>
            </ParallaxHero>

            <div className="max-w-6xl mx-auto px-4 pb-6">
                <FadeIn delay={0.1}>
                    <CallToAction />
                </FadeIn>
            </div>

            <div className="max-w-6xl mx-auto px-4 pb-12">
                <NewsletterSubscribe />
            </div>

            {posts.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 pb-16">
                    <FadeIn className="mb-8">
                        <h2 className="text-white text-2xl font-semibold">Recent Posts</h2>
                    </FadeIn>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {posts.map((post: any) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
