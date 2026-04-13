"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface PostCardProps {
    post: {
        _id: string;
        slug: string;
        image: string;
        title: string;
        category: string;
    };
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <motion.div
            className="relative w-full sm:w-[430px] bg-neutral-900 border border-neutral-800 h-[400px] overflow-hidden rounded-xl"
            whileHover={{ scale: 1.03, y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.6)", borderColor: "#2563eb" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
        >
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <motion.img
                    src={post.image}
                    alt="post cover"
                    className="w-full object-cover"
                    initial={{ height: "260px" }}
                    whileHover={{ height: "200px" }}
                    transition={{ type: "spring" as const, stiffness: 200, damping: 25 }}
                />
                <div className="p-3 flex flex-col gap-2">
                    <p className="text-white text-lg font-semibold line-clamp-2">{post.title}</p>
                    <span className="text-neutral-500 italic text-sm">{post.category}</span>
                </div>
                <motion.div
                    className="absolute left-0 right-0 bottom-0 border border-blue-600 text-blue-400 text-center py-2 rounded-b-xl"
                    initial={{ y: "100%" }}
                    whileHover={{ y: 0, backgroundColor: "#2563eb", color: "#ffffff" }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                >
                    Read article
                </motion.div>
            </Link>
        </motion.div>
    );
}
