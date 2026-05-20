"use client";

import Link from "next/link";
import Image from "next/image";
import GlassCard from "@/components/GlassCard";
import MatrixRain from "@/components/MatrixRain";
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

const COVER_GRADIENTS = [
    "radial-gradient(circle at 30% 40%, rgba(80,140,230,0.35), transparent 60%), #060e1f",
    "radial-gradient(circle at 70% 60%, rgba(40,90,190,0.35), transparent 60%), #060e1f",
    "radial-gradient(circle at 50% 30%, rgba(60,110,220,0.35), transparent 60%), #060e1f",
];

export default function PostCard({ post }: PostCardProps) {
    const readTime    = getReadingTimeMinutes(post.content || "");
    const publishedAt = post.createdAt ? formatPostDate(post.createdAt) : null;
    const category    = getPostCategoryLabel(post.category);
    const gradIdx     = Math.abs(post._id.charCodeAt(0) ?? 0) % COVER_GRADIENTS.length;

    return (
        <Link href={`/blog/${post.slug}`} className="group block w-full sm:w-[430px]">
            <GlassCard className="block w-full">
                {/* Cover */}
                <div
                    className="cover-frame relative h-44 overflow-hidden"
                    style={{ borderBottom: "1px solid var(--hairline)" }}
                >
                    <div className="absolute inset-0" style={{ background: COVER_GRADIENTS[gradIdx] }} />
                    <MatrixRain density={0.35} intensity={0.45} />
                    <div aria-hidden className="cover-grid" />
                    {post.image ? (
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover opacity-60"
                            sizes="(max-width: 640px) 100vw, 430px"
                        />
                    ) : (
                        <div className="absolute inset-0 grid place-items-center">
                            <span
                                className="cover-emoji-wrap float-y text-5xl opacity-85"
                                style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.5))" }}
                            >
                                📝
                            </span>
                        </div>
                    )}
                    <span
                        className="absolute top-3 left-3 text-[11px] font-mono text-neutral-300 px-2.5 py-1 rounded-md"
                        style={{ background: "rgba(3,5,12,0.7)", border: "1px solid var(--hairline)" }}
                    >
                        <span className="text-[rgb(80_140_230)] mr-1.5">#</span>
                        {category}
                    </span>
                    {readTime > 0 && (
                        <span
                            className="absolute bottom-3 right-3 text-[11px] font-mono text-neutral-400 px-2 py-0.5 rounded"
                            style={{ background: "rgba(3,5,12,0.6)", border: "1px solid var(--hairline)" }}
                        >
                            {readTime}m
                        </span>
                    )}
                </div>

                {/* Body */}
                <div className="p-5">
                    <div className="text-[11px] text-neutral-500 mb-2 flex items-center gap-2 font-mono">
                        {publishedAt && <span>{publishedAt}</span>}
                    </div>
                    <h3 className="font-serif font-bold text-white group-hover:text-[rgb(80,140,230)] text-lg leading-tight tracking-tight mb-2 line-clamp-2 transition-colors duration-500">
                        {post.title}
                    </h3>
                    <div
                        className="mt-3 pt-3 flex items-center justify-between text-xs font-mono"
                        style={{ borderTop: "1px solid var(--hairline)" }}
                    >
                        <span style={{ color: "rgb(80 140 230)" }} className="inline-flex items-center gap-1.5">
                            read article →
                        </span>
                    </div>
                </div>
            </GlassCard>
        </Link>
    );
}
