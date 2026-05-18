"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";
import { getPostCategoryLabel } from "@/lib/postCategories";
import { formatPostDate, getReadingTimeMinutes } from "@/utils/readingTime";

interface PostCardProps {
    post: {
        _id: string;
        slug: string;
        image: string;
        title: string;
        category: string;
        content?: string;
        createdAt?: string | Date;
    };
}

/*
 * Named variants let the parent motion.div propagate hover state to children,
 * so the image and the "Read article" button both react to hovering the card —
 * without any coupling between siblings.
 */
const card = {
    idle:    { scale: 1,    y: 0,  boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 10px rgba(255,255,255,0.18), 0 0 35px rgba(255,255,255,0.06), inset 0 1.5px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(255,255,255,0.1), inset 0 0 14px rgba(255,255,255,0.04)" },
    hovered: { scale: 1.03, y: -8, boxShadow: "0 28px 56px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.25), 0 0 50px rgba(255,255,255,0.08), inset 0 1.5px 0 rgba(255,255,255,0.8)" },
};

const imageWrap = {
    idle:    { height: "260px" },
    hovered: { height: "200px" },
};

const readBtn = {
    idle:    { y: "100%", backgroundColor: "transparent", color: "#60a5fa" },
    hovered: { y: "0%",   backgroundColor: "#2563eb",      color: "#ffffff"  },
};

export default function PostCard({ post }: PostCardProps) {
    const readTime    = getReadingTimeMinutes(post.content || "");
    const publishedAt = post.createdAt ? formatPostDate(post.createdAt) : null;
    const category    = getPostCategoryLabel(post.category);

    return (
        /* TiltCard owns the 3D perspective + glare overlay */
        <TiltCard className="w-full sm:w-[430px] h-[400px] rounded-xl">
            {/* motion.div owns hover-state and propagates it via named variants */}
            <motion.div
                className="glass-card relative h-full w-full rounded-xl overflow-hidden"
                variants={card}
                initial="idle"
                whileHover="hovered"
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <Link href={`/blog/${post.slug}`} className="block h-full">
                    {/* Image shrinks on hover — driven by parent variant */}
                    <motion.div
                        className="relative w-full overflow-hidden"
                        variants={imageWrap}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
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
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-neutral-500 text-sm">
                            <span className="italic">{category}</span>
                            {publishedAt && <span>{publishedAt}</span>}
                            <span>{readTime} min read</span>
                        </div>
                    </div>

                    {/* "Read article" slides up from below on card hover */}
                    <motion.div
                        className="absolute left-0 right-0 bottom-0 border border-blue-600 text-center py-2 rounded-b-xl text-sm font-medium"
                        variants={readBtn}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        Read article
                    </motion.div>
                </Link>
            </motion.div>
        </TiltCard>
    );
}
