"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import { BsGithub } from "react-icons/bs";

interface ProjectPageHeroProps {
    title: string;
    image?: string;
    techStack?: string[];
    liveUrl?: string;
    repoUrl?: string;
}

export default function ProjectPageHero({ title, image, techStack, liveUrl, repoUrl }: ProjectPageHeroProps) {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <section ref={heroRef} className="relative overflow-hidden min-h-[65vh] flex items-end">
            {/* Cover image */}
            {image && (
                <Image src={image} alt={title} fill className="object-cover" priority sizes="100vw" />
            )}
            {/* Dark gradient overlay — transparent at top, solid black at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

            {/* Parallax text layer */}
            <motion.div style={{ y }} className="relative z-10 max-w-4xl mx-auto px-4 pb-14 w-full">
                <Link
                    href="/projects"
                    className="inline-block text-neutral-400 hover:text-white text-sm mb-8 transition-colors"
                >
                    ← Projects
                </Link>
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-5">
                    {title}
                </h1>

                {/* Tech stack pills */}
                {techStack && techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-7">
                        {techStack.map((tech) => (
                            <span
                                key={tech}
                                className="text-xs bg-blue-950/60 text-blue-400 border border-blue-900 px-3 py-1 rounded-full"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action links */}
                <div className="flex gap-3 flex-wrap">
                    {liveUrl && (
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                        >
                            <FaExternalLinkAlt className="text-xs" />
                            Live Demo
                        </a>
                    )}
                    {repoUrl && (
                        <a
                            href={repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 border border-neutral-600 hover:border-neutral-400 text-neutral-300 hover:text-white text-sm px-5 py-2.5 rounded-lg transition-colors"
                        >
                            <BsGithub className="text-base" />
                            Repo
                        </a>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
