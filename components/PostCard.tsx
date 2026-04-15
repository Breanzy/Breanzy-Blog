"use client";

import Link from "next/link";
import Image from "next/image";
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
            className="glass-card relative w-full sm:w-[430px] h-[400px] rounded-xl"
            whileHover={{ scale: 1.03, y: -8, boxShadow: "0 28px 56px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.25), 0 0 50px rgba(255,255,255,0.08), inset 0 1.5px 0 rgba(255,255,255,0.8)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
        >
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <motion.div
                    className="relative w-full overflow-hidden"
                    initial={{ height: "260px" }}
                    whileHover={{ height: "200px" }}
                    transition={{ type: "spring" as const, stiffness: 200, damping: 25 }}
                >
                    <Image
                        src={post.image}
                        alt="post cover"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 430px"
                    />
                </motion.div>
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
