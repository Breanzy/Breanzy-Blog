import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

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

    return (
        <main className="bg-black min-h-screen">
            <div className="max-w-3xl mx-auto px-4 pt-12 pb-20">
                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-white text-center leading-tight mb-5">
                    {post && post.title}
                </h1>

                {/* Category pill */}
                <div className="flex justify-center mb-8">
                    <Link to={`/search?category=${post && post.category}`}>
                        <span className="text-xs bg-blue-950/60 text-blue-400 border border-blue-900 px-3 py-1 rounded-full capitalize">
                            {post && post.category}
                        </span>
                    </Link>
                </div>

                {/* Cover image */}
                <img
                    src={post && post.image}
                    alt={post && post.title}
                    className="w-full max-h-[500px] object-cover rounded-xl mb-6"
                />

                {/* Meta: date + read time */}
                <div className="flex justify-between items-center text-neutral-500 text-xs mb-8 pb-4 border-b border-neutral-800">
                    <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="italic">
                        {post && (post.content.length / 1000).toFixed(0)} mins read
                    </span>
                </div>

                {/* Post body */}
                <div
                    className="post-content text-neutral-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post && post.content }}
                />

                {/* CTA */}
                <div className="mt-12">
                    <CallToAction />
                </div>

                {/* Comments */}
                <CommentSection postId={post._id} />
            </div>

            {/* Recent articles */}
            {recentPosts && recentPosts.length > 0 && (
                <div className="bg-neutral-950 py-14">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-white text-xl font-semibold mb-6 text-center">
                            Recent Articles
                        </h2>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {recentPosts.map((p) => (
                                <PostCard key={p._id} post={p} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
