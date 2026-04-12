import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import FadeIn from "../components/FadeIn";
import SEO from "../components/SEO";

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};
const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

export default function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok) { setError(true); setLoading(false); return; }
                setPost(data.posts[0]);
                setLoading(false);
                setError(false);
            } catch {
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            const res = await fetch("/api/post/getposts?limit=3");
            const data = await res.json();
            if (res.ok) setRecentPosts(data.posts);
        };
        fetchRecentPosts();
    }, [postSlug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black">
                <span className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black">
                <p className="text-neutral-400">Post not found.</p>
            </div>
        );
    }

    // Strip HTML tags from content for meta description
    const plainText = post?.content?.replace(/<[^>]+>/g, "") ?? "";
    const excerpt = plainText.slice(0, 160).trim();

    return (
        <main className="bg-black min-h-screen">
            <SEO
                title={post?.title}
                description={excerpt || undefined}
                image={post?.image || undefined}
                url={`/blog/${post?.slug}`}
                type="article"
            />
            <div className="max-w-3xl mx-auto px-4 pt-12 pb-20">
                {/* Title */}
                <FadeIn>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white text-center leading-tight mb-5">
                        {post && post.title}
                    </h1>
                </FadeIn>

                {/* Category pill */}
                <FadeIn delay={0.05} className="flex justify-center mb-8">
                    <Link to={`/search?category=${post && post.category}`}>
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="text-xs bg-blue-950/60 text-blue-400 border border-blue-900 px-3 py-1 rounded-full capitalize cursor-pointer"
                        >
                            {post && post.category}
                        </motion.span>
                    </Link>
                </FadeIn>

                {/* Cover image with scale-in */}
                <motion.img
                    src={post && post.image}
                    alt={post && post.title}
                    className="w-full max-h-[500px] object-cover rounded-xl mb-6"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
                />

                {/* Meta: date + read time */}
                <FadeIn delay={0.15} className="flex justify-between items-center text-neutral-500 text-xs mb-8 pb-4 border-b border-neutral-800">
                    <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="italic">
                        {post && (post.content.length / 1000).toFixed(0)} mins read
                    </span>
                </FadeIn>

                {/* Post body */}
                <FadeIn delay={0.2}>
                    <div
                        className="post-content text-neutral-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post && post.content }}
                    />
                </FadeIn>

                {/* CTA */}
                <FadeIn delay={0.1} className="mt-12">
                    <CallToAction />
                </FadeIn>

                {/* Comments */}
                <CommentSection postId={post._id} />
            </div>

            {/* Recent articles */}
            {recentPosts && recentPosts.length > 0 && (
                <div className="bg-neutral-950 py-14">
                    <div className="max-w-6xl mx-auto px-4">
                        <FadeIn className="text-center mb-6">
                            <h2 className="text-white text-xl font-semibold">Recent Articles</h2>
                        </FadeIn>
                        <motion.div
                            className="flex flex-wrap gap-4 justify-center"
                            variants={gridVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-80px" }}
                        >
                            {recentPosts.map((p) => (
                                <motion.div key={p._id} variants={cardVariant}>
                                    <PostCard post={p} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            )}
        </main>
    );
}
