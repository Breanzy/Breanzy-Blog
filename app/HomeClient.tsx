"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import ProjectCard from "@/components/ProjectCard";
import FadeIn from "@/components/FadeIn";
import MatrixRain from "@/components/MatrixRain";
import ContactForm from "@/components/ContactForm";
import GradientOrbs from "@/components/GradientOrbs";
import IsoCube from "@/components/IsoCube";
import SectionDivider from "@/components/SectionDivider";
import ScrollStory, { type StoryPhase } from "@/components/ScrollStory";
import { ParallaxContainer, ParallaxLayer } from "@/components/Parallax";

// ─── Stagger variants for card grids ────────────────────────────────────────
const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};
const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 15 } },
};

// ─── Hero entrance stagger ──────────────────────────────────────────────────
const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const heroItem = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 15 } },
};

// ─── Skills for sticky-scroll section ───────────────────────────────────────
const skillGroups = [
    {
        category: "Frontend",
        color: "text-blue-400",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux Toolkit"],
    },
    {
        category: "Backend",
        color: "text-violet-400",
        skills: ["Node.js", "MongoDB", "Mongoose", "Firebase", "JWT Auth", "REST APIs", "Resend"],
    },
    {
        category: "Tooling",
        color: "text-emerald-400",
        skills: ["Git", "Vercel", "Docker", "Figma", "VS Code", "Postman"],
    },
];

// ─── Scrollytelling phase content ────────────────────────────────────────────
const storyPhases: StoryPhase[] = [
    {
        id: "writing",
        children: (
            <div className="max-w-3xl mx-auto px-6">
                <p className="text-blue-500 text-xs uppercase tracking-widest font-mono mb-4">01 · writing</p>
                <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    I write about<br />
                    <span className="gradient-text">the journey</span>
                </h2>
                <p className="text-neutral-400 max-w-lg leading-relaxed mb-8">
                    Honest notes on learning to code, shipping products, and figuring it all out — one post at a time.
                </p>
                <div className="neuro-card p-5 max-w-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-blue-400 text-xs font-mono">dev journal</span>
                    </div>
                    <p className="text-white text-base font-semibold mb-1 line-clamp-2">
                        What I learned shipping my first Next.js app
                    </p>
                    <p className="text-neutral-500 text-sm">4 min read · May 2025</p>
                </div>
            </div>
        ),
    },
    {
        id: "building",
        children: (
            <div className="max-w-3xl mx-auto px-6">
                <p className="text-emerald-500/80 text-xs uppercase tracking-widest font-mono mb-4">02 · building</p>
                <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    I build things<br />
                    <span style={{
                        background: "linear-gradient(135deg, #34d399, #60a5fa, #34d399)",
                        backgroundSize: "300% 300%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        animation: "gradient-shift 5s ease infinite",
                    }}>
                        for the web
                    </span>
                </h2>
                <p className="text-neutral-400 max-w-lg leading-relaxed mb-8">
                    Full-stack apps, tools, and experiments — from idea to deployed URL.
                </p>
                <div className="neuro-inset px-5 py-4 max-w-sm font-mono text-sm">
                    <p className="text-neutral-600 mb-1">{`// latest deployment`}</p>
                    <p>
                        <span className="text-violet-400">const </span>
                        <span className="text-blue-300">app </span>
                        <span className="text-neutral-500">= </span>
                        <span className="text-emerald-400">&quot;breanzy.dev&quot;</span>
                    </p>
                    <p>
                        <span className="text-violet-400">export default </span>
                        <span className="text-white">app</span>
                    </p>
                </div>
            </div>
        ),
    },
];

// ─── Component ───────────────────────────────────────────────────────────────
interface HomeClientProps {
    posts: any[];
    projects: any[];
}

export default function HomeClient({ posts, projects }: HomeClientProps) {
    return (
        <div className="bg-black">

            {/* ══════════════════════════════════════════════════════
                HERO — three independent parallax layers
            ══════════════════════════════════════════════════════ */}
            <ParallaxContainer className="relative overflow-hidden min-h-[70vh] flex items-center">

                {/* Layer 0 — Matrix rain fades out as user scrolls */}
                <ParallaxLayer speed={0} opacity={0} className="absolute inset-0">
                    <MatrixRain />
                </ParallaxLayer>

                {/* Layer 1 — Gradient orbs drift + scale (medium speed) */}
                <ParallaxLayer speed={-80} scale={1.3} className="absolute inset-0 pointer-events-none">
                    <GradientOrbs />
                </ParallaxLayer>

                {/* Iso-grid (minimal scroll, just atmospheric) */}
                <div className="iso-grid absolute inset-0 pointer-events-none opacity-60" />

                {/* Layer 2 — Floating isometric cubes (slower than content) */}
                <ParallaxLayer speed={-50} className="absolute inset-0 pointer-events-none">
                    <IsoCube size={44} baseColor="#2563eb" opacity={0.40} floatDelay={0}   className="top-[18%] right-[10%]" />
                    <IsoCube size={28} baseColor="#7c3aed" opacity={0.35} floatDelay={1.2} className="top-[55%] right-[22%]" />
                    <IsoCube size={36} baseColor="#0d9488" opacity={0.30} floatDelay={2.1} className="bottom-[20%] left-[8%]" />
                    <IsoCube size={20} baseColor="#2563eb" opacity={0.25} floatDelay={0.7} className="top-[30%] left-[16%]" />
                </ParallaxLayer>

                {/* Layer 3 — Hero text (fastest parallax layer) */}
                <ParallaxLayer speed={-150} className="relative z-10 w-full">
                    <div className="max-w-6xl mx-auto px-4 py-28 flex flex-col gap-6 w-full">
                        <motion.div variants={heroContainer} initial="hidden" animate="show">
                            <motion.p variants={heroItem} className="text-blue-500 text-sm font-medium tracking-widest uppercase mb-2">
                                Full-Stack Developer
                            </motion.p>
                            <motion.h1 variants={heroItem} className="text-4xl lg:text-7xl font-bold text-white leading-tight mb-4">
                                Hi, I&apos;m <span className="gradient-text">Brean</span>
                            </motion.h1>
                            <motion.p variants={heroItem} className="text-neutral-400 text-base max-w-xl leading-relaxed mb-6">
                                I build things for the web, and write about life as a software developer — the good days,
                                the stuck days, and everything I pick up along the way.
                            </motion.p>
                            <motion.div variants={heroItem} className="flex gap-3 flex-wrap">
                                <motion.div
                                    whileHover={{ scale: 1.06, boxShadow: "0 0 24px rgba(37,99,235,0.45)" }}
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="rounded-lg"
                                >
                                    <Link href="/projects" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors block">
                                        View My Projects
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="rounded-lg"
                                >
                                    <Link href="/blog" className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white font-medium px-6 py-2.5 rounded-lg transition-colors block">
                                        Read My Blog
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </ParallaxLayer>
            </ParallaxContainer>


            {/* ══════════════════════════════════════════════════════
                SCROLLYTELLING — two-phase pinned story
            ══════════════════════════════════════════════════════ */}
            <ScrollStory phases={storyPhases} totalHeight="220vh" />


            {/* ══════════════════════════════════════════════════════
                RECENT POSTS
            ══════════════════════════════════════════════════════ */}
            {posts.length > 0 && (
                <section className="py-16 border-t border-white/[0.04]">
                    <div className="max-w-6xl mx-auto px-4">
                        <SectionDivider index="02" label="Blog" />
                        <FadeIn className="flex items-center justify-between mb-8">
                            <h2 className="text-white text-2xl font-semibold">Recent Posts</h2>
                            <Link href="/blog" className="text-blue-500 hover:text-blue-400 text-sm transition-colors">
                                View all →
                            </Link>
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


            {/* ══════════════════════════════════════════════════════
                STICKY SCROLL — skills with neumorphic tags
            ══════════════════════════════════════════════════════ */}
            <section className="py-16 border-t border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-4">
                    <SectionDivider index="03" label="Stack" />
                    <FadeIn className="mb-12">
                        <h2 className="text-white text-2xl font-semibold mb-2">What I work with</h2>
                        <p className="text-neutral-500 text-sm">Technologies I reach for day-to-day.</p>
                    </FadeIn>

                    <div className="space-y-16">
                        {skillGroups.map((group, gi) => (
                            <div key={group.category} className="flex gap-8 lg:gap-16">
                                {/* Sticky category label (desktop only) */}
                                <div className="sticky top-28 h-fit w-28 shrink-0 hidden lg:block">
                                    <FadeIn delay={gi * 0.08} variant="left">
                                        <p className={`text-xs uppercase tracking-widest font-mono ${group.color}`}>
                                            {group.category}
                                        </p>
                                        <div className="mt-2 w-6 h-px bg-white/10" />
                                    </FadeIn>
                                </div>

                                {/* Skill tags — neumorphic, scroll-triggered stagger */}
                                <motion.div
                                    className="flex-1 flex flex-wrap gap-2 items-start"
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, margin: "-60px" }}
                                    variants={{
                                        hidden: {},
                                        show: { transition: { staggerChildren: 0.07, delayChildren: gi * 0.05 } },
                                    }}
                                >
                                    {/* Mobile: inline category label */}
                                    <p className={`w-full text-xs uppercase tracking-widest font-mono ${group.color} lg:hidden mb-2`}>
                                        {group.category}
                                    </p>
                                    {group.skills.map((skill) => (
                                        <motion.span
                                            key={skill}
                                            variants={{
                                                hidden: { opacity: 0, scale: 0.85, y: 10 },
                                                show:   { opacity: 1, scale: 1,    y: 0  },
                                            }}
                                            whileHover={{ scale: 1.06, y: -2 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="neuro-card px-4 py-2 text-sm text-white/75 cursor-default select-none"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ══════════════════════════════════════════════════════
                FEATURED PROJECTS
            ══════════════════════════════════════════════════════ */}
            {projects.length > 0 && (
                <section className="py-16 border-t border-white/[0.04]">
                    <div className="max-w-6xl mx-auto px-4">
                        <SectionDivider index="04" label="Projects" />
                        <FadeIn className="flex items-center justify-between mb-8">
                            <h2 className="text-white text-2xl font-semibold">Featured Projects</h2>
                            <Link href="/projects" className="text-blue-500 hover:text-blue-400 text-sm transition-colors">
                                View all →
                            </Link>
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


            {/* ══════════════════════════════════════════════════════
                CONTACT
            ══════════════════════════════════════════════════════ */}
            <section className="py-16 border-t border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-4">
                    <SectionDivider index="05" label="Contact" />
                    <ContactForm />
                </div>
            </section>
        </div>
    );
}
