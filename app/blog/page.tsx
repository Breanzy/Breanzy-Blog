import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import PostCard from "@/components/PostCard";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
import MiniHero from "@/components/MiniHero";
import AnimatedDivider from "@/components/AnimatedDivider";
import { BreadcrumbSchema, ItemListSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "The Breanzy blog — down-to-earth, anti-corporate-speak takes on the tech industry from a developer struggling to keep up, written like a chat with another dev who gets it.",
};

const getPosts = unstable_cache(
    async () => {
        await connectDB();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .select("title slug image category content createdAt")
            .lean();
        return JSON.parse(JSON.stringify(posts));
    },
    ["blog-list"],
    { tags: ["posts"], revalidate: false }
);

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <div style={{ background: "var(--ink-0)" }}>
            <BreadcrumbSchema
                items={[
                    { name: "Home", path: "/" },
                    { name: "Blog", path: "/blog" },
                ]}
            />
            {posts.length > 0 && (
                <ItemListSchema
                    items={posts.map((p: any) => ({ name: p.title, path: `/blog/${p.slug}` }))}
                />
            )}

            <MiniHero
                eyebrow="cat ./blog"
                title="BLOG."
                accentWord="BLOG"
                subtitle="notes on life as a software developer — the good days, the stuck days, and the lessons along the way."
            />

            <div className="max-w-6xl mx-auto px-6 py-6 pb-10">
                <NewsletterSubscribe />
            </div>

            {posts.length > 0 && (
                <>
                    <AnimatedDivider marker="// archive" label="all posts · sorted by date" />
                    <div className="max-w-6xl mx-auto px-6 pt-10 pb-16">
                        <div
                            className="text-xs mb-3 flex items-center gap-2 uppercase tracking-[0.2em] font-mono"
                            style={{ color: "rgb(80 140 230)" }}
                        >
                            <span className="w-6 h-px" style={{ background: "rgb(80 140 230)" }} /> all posts
                        </div>
                        <h2
                            className="font-serif font-black text-white text-3xl tracking-tight uppercase leading-[0.95] mb-8"
                        >
                            ALL <span style={{ color: "rgb(80 140 230)" }}>POSTS</span>.
                        </h2>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {posts.map((post: any) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
