import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function Blog() {
    const [posts, setPosts] = useState([]);

    // Fetch all posts on mount
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch("/api/post/getPosts");
            const data = await res.json();
            if (res.ok) setPosts(data.posts);
        };
        fetchPosts();
    }, []);

    return (
        <div className="bg-black min-h-screen">
            {/* Header */}
            <div className="max-w-6xl mx-auto px-4 py-20">
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">Blog</h1>
                <p className="text-neutral-400 text-base max-w-xl">
                    Thoughts, tutorials, and write-ups on web development,
                    full-stack projects, and everything in between.
                </p>
                <Link
                    to="/search"
                    className="inline-block mt-4 text-sm text-blue-500 hover:text-blue-400 transition-colors"
                >
                    Browse all posts →
                </Link>
            </div>

            {/* CTA */}
            <div className="max-w-6xl mx-auto px-4 pb-12">
                <CallToAction />
            </div>

            {/* Posts grid */}
            {posts.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 pb-16">
                    <h2 className="text-white text-2xl font-semibold mb-8">Recent Posts</h2>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
