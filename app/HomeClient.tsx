"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PostCard from "@/components/PostCard";
import ProjectCard from "@/components/ProjectCard";
import MatrixRain from "@/components/MatrixRain";
import Aurora from "@/components/Aurora";
import HeroHUD from "@/components/HeroHUD";
import HexTicker from "@/components/HexTicker";
import ScanSweep from "@/components/ScanSweep";
import GlassCard from "@/components/GlassCard";
import AnimatedDivider from "@/components/AnimatedDivider";
import ContactForm from "@/components/ContactForm";

// Fallback texts if GitHub README fetch fails
const FALLBACK_TEXTS = [
    "shipping small improvements",
    "building doreh",
    "building passabuy",
    "hacking on cutmaxx",
    "turning yemelay into a saas",
];

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};
const cardVariant = {
    hidden: { opacity: 0, y: 36 },
    show:   { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 15 } },
};

function SectionHeader({
    kicker,
    title,
    accentWord,
    href = "#",
}: {
    kicker: string;
    title: string;
    accentWord?: string;
    href?: string;
}) {
    return (
        <div className="flex items-end justify-between mb-10 reveal-fast">
            <div>
                <div
                    className="text-xs mb-3 flex items-center gap-2 uppercase tracking-[0.2em] font-mono"
                    style={{ color: "rgb(80 140 230)" }}
                >
                    <span className="w-6 h-px divider-line" style={{ background: "rgb(80 140 230)" }} />{" "}
                    {kicker}
                </div>
                <h2
                    className="font-serif font-black text-white tracking-[-0.03em] leading-[0.95] uppercase"
                    style={{ fontSize: "clamp(2rem,4vw,3rem)" }}
                >
                    {accentWord ? (
                        <>
                            {title.split(accentWord)[0]}
                            <span style={{ color: "rgb(80 140 230)" }}>{accentWord}</span>
                            {title.split(accentWord)[1]}
                        </>
                    ) : title}
                </h2>
            </div>
            <Link
                href={href}
                className="nav-link text-sm text-neutral-400 hover:text-[rgb(80,140,230)] transition-colors duration-500 pb-2 inline-flex items-center gap-1.5 font-mono"
            >
                view all <span>→</span>
            </Link>
        </div>
    );
}

interface HomeClientProps {
    posts: any[];
    projects: any[];
    statusTexts?: string[];
}

export default function HomeClient({ posts, projects, statusTexts = [] }: HomeClientProps) {
    const heroRef = useRef<HTMLElement>(null);

    // Scroll-linked parallax for hero layers
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const matrixY  = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
    const auroraY  = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
    const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
    const gridY    = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

    // Rotating status pill text
    const allTexts = statusTexts.length ? statusTexts : FALLBACK_TEXTS;
    const [textIdx, setTextIdx] = useState(0);
    const [fading, setFading] = useState(false);

    const advanceText = useCallback(() => {
        setFading(true);
        setTimeout(() => {
            setTextIdx((i) => (i + 1) % allTexts.length);
            setFading(false);
        }, 400);
    }, [allTexts.length]);

    useEffect(() => {
        const id = setInterval(advanceText, 4000);
        return () => clearInterval(id);
    }, [advanceText]);

    return (
        <div style={{ background: "var(--ink-0)" }}>

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section
                ref={heroRef}
                className="relative min-h-[760px] overflow-hidden flex items-center"
            >
                {/* Parallax matrix rain */}
                <motion.div
                    className="absolute inset-0"
                    style={{ y: matrixY }}
                >
                    <MatrixRain density={0.7} intensity={0.7} />
                </motion.div>

                {/* Parallax aurora blobs */}
                <motion.div className="absolute inset-0" style={{ y: auroraY }}>
                    <Aurora />
                </motion.div>

                {/* Parallax grid */}
                <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none opacity-[0.2]"
                    style={{
                        y: gridY,
                        zIndex: 2,
                        backgroundImage:
                            "linear-gradient(rgb(80 140 230 / 0.15) 1px, transparent 1px), linear-gradient(90deg, rgb(80 140 230 / 0.15) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                        maskImage: "radial-gradient(ellipse at center, black 25%, transparent 70%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 70%)",
                    }}
                />

                <HexTicker y="40%" />
                <ScanSweep />
                <HeroHUD />

                {/* Parallax content */}
                <motion.div
                    className="relative z-20 max-w-6xl mx-auto px-6 w-full py-20"
                    style={{ y: contentY }}
                >
                    {/* Status badge — rotates through README "currently" items; click to skip ahead */}
                    <button
                        type="button"
                        onClick={advanceText}
                        aria-label="Show next status"
                        className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md cursor-pointer hover:border-white/20 hover:bg-white/[0.05] transition-colors"
                        style={{ background: "rgba(255,255,255,0.03)", transform: "rotate(-2deg)" }}
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span
                            className="text-xs text-neutral-400 transition-opacity duration-400"
                            style={{ opacity: fading ? 0 : 1 }}
                        >
                            currently:{" "}
                            <span className="text-white">{allTexts[textIdx]}</span>
                        </span>
                    </button>

                    {/* Headline */}
                    <div className="reveal">
                        <div
                            className="font-mono text-[11px] tracking-[0.2em] uppercase mb-4 flex items-center gap-2 reveal-slide"
                            style={{ color: "rgb(80 140 230 / 0.8)" }}
                        >
                            <span className="text-neutral-600">$</span>
                            <span>full-stack developer</span>
                            <span className="text-neutral-600">--verbose</span>
                            <span
                                className="inline-block w-2 h-3.5 ml-1 animate-pulse"
                                style={{ background: "rgb(80 140 230)" }}
                            />
                        </div>

                        <h1
                            className="font-serif font-black text-white leading-[0.92] tracking-[-0.03em] uppercase relative"
                            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)" }}
                        >
                            <span
                                aria-hidden
                                className="absolute -left-6 top-0 bottom-0 w-px hidden md:block divider-line"
                                style={{ background: "rgb(80 140 230 / 0.3)", transformOrigin: "top" }}
                            />
                            <span className="text-neutral-600 font-semibold">{"// "}</span>HI, I&apos;M{" "}
                            <span
                                className="glitch-text"
                                data-text="BREANZY"
                                style={{ color: "rgb(80 140 230)", textShadow: "0 0 28px rgba(80,140,230,0.35)" }}
                            >
                                BREANZY
                            </span>
                            <span className="animate-pulse" style={{ color: "rgb(80 140 230)" }}>_</span>
                            <br />
                            <span className="text-neutral-600 font-semibold">I BUILD THINGS</span>
                            <br />
                            <span>
                                FOR THE{" "}
                                <span style={{ color: "rgb(80 140 230)" }}>
                                    <span style={{ color: "rgb(80 140 230 / 0.5)" }}>[</span>WEB
                                    <span style={{ color: "rgb(80 140 230 / 0.5)" }}>]</span>
                                </span>
                                .
                            </span>
                        </h1>

                        <p className="mt-6 text-neutral-400 text-base leading-relaxed max-w-lg font-mono">
                            <span style={{ color: "rgb(80 140 230 / 0.7)" }}>&gt;</span> i build things for
                            the web, and write about life as a software developer — the good days, the stuck
                            days, and everything{" "}
                            <span className="text-neutral-300">i pick up along the way</span>.
                        </p>
                    </div>

                    <div
                        className="mt-10 flex flex-wrap items-center gap-3 reveal"
                        style={{ animationDelay: "0.2s" }}
                    >
                        <Link href="/projects" className="btn-primary">
                            <span className="opacity-50">&gt;</span> view my projects{" "}
                            <span className="arrow">→</span>
                        </Link>
                        <Link href="/blog" className="btn-ghost">
                            <span className="opacity-50">cat</span> ./blog.md
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* ── Recent Posts ─────────────────────────────────────────── */}
            {posts.length > 0 && (
                <>
                    <div className="pt-8 pb-2">
                        <AnimatedDivider marker="// 01" label="recent posts · stream" />
                    </div>
                    <section
                        className="relative py-16 overflow-hidden"
                        style={{ borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}
                    >
                        <div className="max-w-6xl mx-auto px-6">
                            <SectionHeader
                                kicker="recent posts"
                                title="RECENT POSTS."
                                accentWord="POSTS"
                                href="/blog"
                            />
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
                </>
            )}

            {/* ── Featured Projects ─────────────────────────────────────── */}
            {projects.length > 0 && (
                <>
                    <div className="pt-8 pb-2">
                        <AnimatedDivider marker="// 02" label="featured projects · case studies" />
                    </div>
                    <section className="relative py-16">
                        <div className="max-w-6xl mx-auto px-6">
                            <SectionHeader
                                kicker="featured projects"
                                title="FEATURED PROJECTS."
                                accentWord="PROJECTS"
                                href="/projects"
                            />
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
                </>
            )}

            {/* ── Contact ──────────────────────────────────────────────── */}
            <div className="pt-2 pb-2">
                <AnimatedDivider marker="// 03" label="contact · inbound channel" />
            </div>
            <section
                className="relative py-24"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
                <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{ background: "radial-gradient(ellipse at center, rgba(40,90,190,0.15), transparent 60%)" }}
                />
                <div className="max-w-2xl mx-auto px-6 relative">
                    <GlassCard className="p-8">
                        <div
                            className="text-xs mb-3 flex items-center gap-2 uppercase tracking-[0.2em]"
                            style={{ color: "rgb(80 140 230)" }}
                        >
                            <span className="w-6 h-px" style={{ background: "rgb(80 140 230)" }} /> contact
                        </div>
                        <h2 className="font-serif font-black text-white text-3xl tracking-tight uppercase leading-[0.95] mb-2">
                            REACH OUT <span style={{ color: "rgb(80 140 230)" }}>TO ME.</span>
                        </h2>
                        <p className="text-neutral-400 text-sm mb-6">
                            whether it&apos;s a job opportunity, a project idea, or just a hello — i&apos;d love
                            to hear from you.
                        </p>
                        <ContactForm />
                    </GlassCard>
                </div>
            </section>
        </div>
    );
}
