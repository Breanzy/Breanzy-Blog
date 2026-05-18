"use client";

/**
 * Generic scrollytelling component.
 *
 * Renders a tall scroll container with a sticky full-screen panel.
 * As the user scrolls through, phases animate in/out with an
 * AnimatePresence cross-fade. Phase switching is driven by scroll
 * position — no manual state management needed at the call site.
 *
 * Usage:
 *   const phases: StoryPhase[] = [
 *     { id: "one", children: <p>Phase one content</p> },
 *     { id: "two", children: <p>Phase two content</p> },
 *   ];
 *   <ScrollStory phases={phases} totalHeight="200vh" />
 */

import { useRef, useState } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
    useSpring,
    useMotionValueEvent,
} from "framer-motion";

export interface StoryPhase {
    id: string;
    children: React.ReactNode;
}

interface ScrollStoryProps {
    phases: StoryPhase[];
    /** Total scroll height of the section. Default "220vh" */
    totalHeight?: string;
    /** Show the vertical progress bar on the left. Default true */
    showProgress?: boolean;
    /** Show phase-indicator dots on the right. Default true */
    showDots?: boolean;
    className?: string;
}

export default function ScrollStory({
    phases,
    totalHeight = "220vh",
    showProgress = true,
    showDots = true,
    className = "",
}: ScrollStoryProps) {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    /* Spring-smoothed progress for the bar */
    const springP = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
    const barHeight = useTransform(springP, [0, 1], ["0%", "100%"]);

    /* Discrete phase index — only re-renders on phase boundary, not every frame */
    const [active, setActive] = useState(0);
    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const next = Math.min(Math.floor(v * phases.length), phases.length - 1);
        setActive((prev) => (prev !== next ? next : prev));
    });

    return (
        <section
            ref={containerRef}
            className={`relative ${className}`}
            style={{ height: totalHeight }}
        >
            <div className="sticky top-0 h-screen overflow-hidden bg-black flex items-center">

                {/* Ambient iso-grid background */}
                <div className="absolute inset-0 iso-grid opacity-30 pointer-events-none" />

                {/* Vertical progress bar — left edge */}
                {showProgress && (
                    <div className="story-progress-track hidden md:block">
                        <motion.div
                            className="absolute top-0 left-0 right-0 bg-blue-500 rounded-full"
                            style={{ height: barHeight }}
                        />
                    </div>
                )}

                {/* Phase indicator dots — right edge */}
                {showDots && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-10">
                        {phases.map((phase, i) => (
                            <div
                                key={phase.id}
                                className={`rounded-full transition-all duration-300 ${
                                    i === active
                                        ? "w-2 h-2 bg-blue-500"
                                        : "w-1.5 h-1.5 bg-white/20"
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Phase content with cross-fade */}
                <div className="relative w-full h-full flex items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={phases[active]?.id}
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -28 }}
                            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full"
                        >
                            {phases[active]?.children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
