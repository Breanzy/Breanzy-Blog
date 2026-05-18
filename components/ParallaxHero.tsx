"use client";

import FadeIn from "./FadeIn";
import GradientOrbs from "./GradientOrbs";
import { ParallaxContainer, ParallaxLayer } from "./Parallax";

interface ParallaxHeroProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

const HERO_ORBS = [
    { className: "-top-32 -left-32", color: "#3b82f6", size: "500px", opacity: 0.12, animClass: "orb-a" as const },
    { className: "top-0 right-0",    color: "#a78bfa", size: "400px", opacity: 0.08, animClass: "orb-b" as const },
];

/**
 * Reusable hero section with three independent parallax layers:
 *   1. Isometric grid  — moves at speed -60  (slowest)
 *   2. Gradient orbs   — moves at speed -90, scales to 1.3
 *   3. Text content    — moves at speed -120 (fastest)
 */
export default function ParallaxHero({ title, subtitle, children }: ParallaxHeroProps) {
    return (
        <ParallaxContainer className="relative overflow-hidden pt-24 pb-28">
            {/* Layer 1 — iso-grid (slowest) */}
            <ParallaxLayer speed={-60} className="iso-grid absolute inset-0 pointer-events-none" />

            {/* Layer 2 — gradient orbs (medium) */}
            <ParallaxLayer speed={-90} scale={1.3} className="absolute inset-0 pointer-events-none">
                <GradientOrbs orbs={HERO_ORBS} />
            </ParallaxLayer>

            {/* Bottom-to-background fade */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#050507]" />

            {/* Layer 3 — content (fastest) */}
            <ParallaxLayer speed={-120} className="relative z-10 max-w-6xl mx-auto px-4">
                <FadeIn>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 gradient-text">{title}</h1>
                    <p className="text-neutral-400 text-base max-w-xl leading-relaxed">{subtitle}</p>
                    {children}
                </FadeIn>
            </ParallaxLayer>
        </ParallaxContainer>
    );
}
