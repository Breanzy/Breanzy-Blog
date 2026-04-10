import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PostCard from "../components/PostCard";
import FadeIn from "../components/FadeIn";

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};
const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

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
                <FadeIn>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">Blog</h1>
                    <p className="text-neutral-400 text-base max-w-xl">
                        Thoughts, tutorials, and write-ups on web development,
                        full-stack projects, and everything in between.
                    </p>
                    <Link to="/search" className="inline-block mt-4 text-sm text-blue-500 hover:text-blue-400 transition-colors">
                        Browse all posts →
                    </Link>
                </FadeIn>
            </div>

            {/* CTA */}
            <div className="max-w-6xl mx-auto px-4 pb-12">
                <FadeIn delay={0.1}>
                    <CallToAction />
                </FadeIn>
            </div>

            {/* Posts grid */}
            {posts.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 pb-16">
                    <FadeIn className="mb-8">
                        <h2 className="text-white text-2xl font-semibold">Recent Posts</h2>
                    </FadeIn>
                    <motion.div
                        className="flex flex-wrap gap-4 justify-center"
                        variants={gridVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-80px" }}
                    >
                        {posts.map((post) => (
                            <motion.div key={post._id} variants={cardVariant}>
                                <PostCard post={post} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
