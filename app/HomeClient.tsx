"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PostCard from "@/components/PostCard";
import ProjectCard from "@/components/ProjectCard";
import FadeIn from "@/components/FadeIn";
import MatrixRain from "@/components/MatrixRain";
import { HiOutlineBriefcase, HiOutlineChatAlt2, HiOutlineLightBulb, HiOutlineMail } from "react-icons/hi";

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
const current = [
    {
        label: "Building",
        text: "Polishing this site into a sharper writing space and portfolio.",
    },
    {
        label: "Learning",
        text: "Deeper Next.js patterns, product thinking, and cleaner publishing workflows.",
    },
    {
        label: "Focusing",
        text: "Shipping small improvements consistently and turning projects into better case studies.",
    },
];
const tools = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB", "Vercel", "Firebase", "Resend"];
const email = "hello@breanzy.com";
const contactIntents = [
    { label: "Hire me", icon: HiOutlineBriefcase, href: `mailto:${email}?subject=Work%20opportunity%20for%20Breanzy` },
    { label: "Collaborate", icon: HiOutlineLightBulb, href: `mailto:${email}?subject=Collaboration%20idea` },
    { label: "Ask about a project", icon: HiOutlineChatAlt2, href: `mailto:${email}?subject=Question%20about%20your%20project` },
    { label: "Say hi", icon: HiOutlineMail, href: `mailto:${email}?subject=Hello%20Breanzy` },
];

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
                            I build things for the web, and write about life as a software developer — the good days, the stuck days, and everything I pick up along the way.
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

            {/* Recent posts */}
            {posts.length > 0 && (
                <section className="py-16 border-t border-b border-white/[0.04]">
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

            {/* About / now */}
            <section className="py-16 bg-white/[0.025] border-b border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-4 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <FadeIn>
                        <p className="text-blue-500 text-sm font-medium mb-3">About</p>
                        <h2 className="text-white text-3xl font-semibold mb-4">I build, write, and keep the work visible.</h2>
                        <div className="flex flex-col gap-4 text-neutral-400 leading-relaxed">
                            <p>
                                I'm Brean Julius Carbonilla, a full-stack developer based in the Philippines. I like building web applications that feel useful, maintainable, and honest about how they work.
                            </p>
                            <p>
                                This site is where the threads meet: the things I ship, the notes I write, the stack I use, and the occasional lesson that was expensive enough to remember.
                            </p>
                        </div>
                    </FadeIn>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {current.map((item, index) => (
                            <FadeIn key={item.label} delay={index * 0.08}>
                                <div className="border border-neutral-800 bg-black rounded-xl p-5 h-full">
                                    <h3 className="text-white font-semibold mb-3">{item.label}</h3>
                                    <p className="text-neutral-500 text-sm leading-relaxed">{item.text}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured projects */}
            {projects.length > 0 && (
                <section className="py-16">
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

            {/* Uses / contact */}
            <section className="bg-white/[0.025] py-16 border-t border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-4 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
                    <FadeIn>
                        <p className="text-blue-500 text-sm font-medium mb-3">Uses</p>
                        <h2 className="text-white text-2xl font-semibold mb-5">Tools I keep coming back to</h2>
                        <div className="flex flex-wrap gap-2">
                            {tools.map((tool) => (
                                <span key={tool} className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1 rounded-full">
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <p className="text-blue-500 text-sm font-medium mb-3">Contact</p>
                        <h2 className="text-white text-2xl font-semibold mb-5">Reach out with a clear starting point</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {contactIntents.map((intent) => {
                                const Icon = intent.icon;
                                return (
                                    <a key={intent.label} href={intent.href} className="flex items-center gap-3 border border-neutral-800 bg-black rounded-xl px-4 py-3 text-neutral-300 hover:text-white hover:border-blue-700 transition-colors">
                                        <Icon className="text-blue-500 text-lg shrink-0" />
                                        <span className="text-sm font-medium">{intent.label}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
}
