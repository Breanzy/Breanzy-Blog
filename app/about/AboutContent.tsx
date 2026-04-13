"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";

const tech = ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Firebase", "Redux"];

const badgeVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};
const badgeItem = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 15 } },
};

export default function AboutContent() {
    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-3xl mx-auto px-4 py-24">
                <FadeIn>
                    <h1 className="text-4xl font-bold text-white mb-10">About</h1>
                </FadeIn>

                <div className="flex flex-col gap-6 text-neutral-400 text-base leading-relaxed">
                    {[
                        "I'm Brean Julius Carbonilla — a full-stack developer based in the Philippines. I enjoy building web applications that are functional, well-designed, and worth maintaining.",
                        "This site is where I document what I build and what I learn. It started as a MERN stack learning project and evolved into a personal space for sharing projects, writing, and my resume.",
                        "I'm interested in everything from backend architecture and APIs to clean UI and developer experience. If something's worth building, I want to understand how it works end to end.",
                    ].map((text, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <p>{text}</p>
                        </FadeIn>
                    ))}
                </div>

                <FadeIn delay={0.3} className="mt-12 border-t border-neutral-800 pt-10">
                    <h2 className="text-white font-semibold text-lg mb-4">Built with</h2>
                    <motion.div
                        className="flex flex-wrap gap-2"
                        variants={badgeVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {tech.map((t) => (
                            <motion.span
                                key={t}
                                variants={badgeItem}
                                whileHover={{ scale: 1.1, y: -2 }}
                                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                                className="text-sm bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1 rounded-full cursor-default"
                            >
                                {t}
                            </motion.span>
                        ))}
                    </motion.div>
                </FadeIn>
            </div>
        </div>
    );
}
