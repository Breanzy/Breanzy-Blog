"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PostCard from "@/components/PostCard";
import ProjectCard from "@/components/ProjectCard";
import FadeIn from "@/components/FadeIn";
import MatrixRain from "@/components/MatrixRain";

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};
const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 15 } },
};
const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const heroItem = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 15 } },
};

interface HomeClientProps {
    posts: any[];
    projects: any[];
}

export default function HomeClient({ posts, projects }: HomeClientProps) {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, -150]);

    return (
        <div className="bg-black">
            {/* Hero with parallax */}
            <section ref={heroRef} className="relative overflow-hidden min-h-[70vh] flex items-center">
                <MatrixRain />
                <motion.div style={{ y: heroY }} className="relative z-10 max-w-6xl mx-auto px-4 py-28 flex flex-col gap-6 w-full">
                    <motion.div variants={heroContainer} initial="hidden" animate="show">
                        <motion.p variants={heroItem} className="text-blue-500 text-sm font-medium tracking-widest uppercase mb-2">
                            Full-Stack Developer
                        </motion.p>
                        <motion.h1 variants={heroItem} className="text-4xl lg:text-7xl font-bold text-white leading-tight mb-4">
                            Hi, I'm <span className="text-blue-500">Brean</span>
                        </motion.h1>
                        <motion.p variants={heroItem} className="text-neutral-400 text-base max-w-xl leading-relaxed mb-6">
                            I build things for the web — from full-stack applications to personal tools. I write about what I learn and share it here.
                        </motion.p>
                        <motion.div variants={heroItem} className="flex gap-3 flex-wrap">
                            <motion.div
                                whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                                className="rounded-lg"
                            >
                                <Link href="/projects" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors block">
                                    View My Projects
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                                className="rounded-lg"
                            >
                                <Link href="/blog" className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white font-medium px-6 py-2.5 rounded-lg transition-colors block">
                                    Read My Blog
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Featured projects */}
            {projects.length > 0 && (
                <section className="bg-white/[0.025] py-16 border-t border-b border-white/[0.04]">
                    <div className="max-w-6xl mx-auto px-4">
                        <FadeIn className="flex items-center justify-between mb-8">
                            <h2 className="text-white text-2xl font-semibold">Featured Projects</h2>
                            <Link href="/projects" className="text-blue-500 hover:text-blue-400 text-sm transition-colors">View all →</Link>
                        </FadeIn>
                        <motion.div
                            className="flex flex-wrap gap-4 justify-center"
                            variants={gridVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-80px" }}
                        >
                            {projects.map((project) => (
                                <motion.div key={project._id} variants={cardVariant}>
                                    <ProjectCard project={project} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Recent posts */}
            {posts.length > 0 && (
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <FadeIn className="flex items-center justify-between mb-8">
                            <h2 className="text-white text-2xl font-semibold">Recent Posts</h2>
                            <Link href="/blog" className="text-blue-500 hover:text-blue-400 text-sm transition-colors">View all →</Link>
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
                </section>
            )}
        </div>
    );
}
