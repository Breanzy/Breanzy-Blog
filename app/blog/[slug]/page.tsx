import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Post from "@/models/post.model";
import CommentSection from "@/components/CommentSection";
import CallToAction from "@/components/CallToAction";
import PostCard from "@/components/PostCard";
import FadeIn from "@/components/FadeIn";

const getPost = unstable_cache(
    async (slug: string) => {
        await connectDB();
        const post = await Post.findOne({ slug }).lean();
        return post ? JSON.parse(JSON.stringify(post)) : null;
    },
    ["post-by-slug"],
    { tags: ["posts"], revalidate: false }
);

const getRecentPosts = unstable_cache(
    async () => {
        await connectDB();
        const posts = await Post.find().sort({ updatedAt: -1 }).limit(3).select("-content").lean();
        return JSON.parse(JSON.stringify(posts));
    },
    ["recent-posts"],
    { tags: ["posts"], revalidate: false }
);

// Pre-render all known post slugs at build time; new posts are rendered on first visit then cached
export async function generateStaticParams() {
    await connectDB();
    const posts = await Post.find({}, "slug").lean();
    return (posts as any[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = await getPost(params.slug);
    if (!post) return {};
    const description = post.content.replace(/<[^>]+>/g, "").slice(0, 160).trim();
    return {
        title: post.title,
        description: description || undefined,
        openGraph: {
            title: post.title,
            description: description || undefined,
            type: "article",
            images: post.image ? [post.image] : undefined,
            url: `/blog/${post.slug}`,
        },
        twitter: { card: "summary_large_image" },
    };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const [post, recentPosts] = await Promise.all([getPost(params.slug), getRecentPosts()]);
    if (!post) notFound();

    return (
        <main className="bg-black min-h-screen">
            <div className="max-w-3xl mx-auto px-4 pt-12 pb-20">
                <FadeIn>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white text-center leading-tight mb-5">
                        {post.title}
                    </h1>
                </FadeIn>

                <FadeIn delay={0.05} className="flex justify-center mb-8">
                    <Link href={`/search?category=${post.category}`}>
                        <span className="text-xs bg-blue-950/60 text-blue-400 border border-blue-900 px-3 py-1 rounded-full capitalize cursor-pointer hover:bg-blue-900/40 transition-colors">
                            {post.category}
                        </span>
                    </Link>
                </FadeIn>

                {/* Cover image */}
                {post.image && (
                    <Image
                        src={post.image}
                        alt={post.title}
                        width={900}
                        height={500}
                        priority
                        className="w-full max-h-[500px] object-cover rounded-xl mb-6"
                    />
                )}

                {/* Meta */}
                <FadeIn delay={0.15} className="flex justify-between items-center text-neutral-500 text-xs mb-8 pb-4 border-b border-neutral-800">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="italic">{(post.content.length / 1000).toFixed(0)} mins read</span>
                </FadeIn>

                {/* Post body — HTML from rich text editor */}
                <FadeIn delay={0.2}>
                    <div
                        className="post-content text-neutral-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </FadeIn>

                <FadeIn delay={0.1} className="mt-12">
                    <CallToAction />
                </FadeIn>

                <CommentSection postId={post._id} />
            </div>

            {recentPosts.length > 0 && (
                <div className="bg-neutral-950 py-14">
                    <div className="max-w-6xl mx-auto px-4">
                        <FadeIn className="text-center mb-6">
                            <h2 className="text-white text-xl font-semibold">Recent Articles</h2>
                        </FadeIn>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {recentPosts.map((p: any) => (
                                <PostCard key={p._id} post={p} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
