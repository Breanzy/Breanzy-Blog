"use client";

/**
 * Context-based parallax system.
 *
 * Wrap any section in <ParallaxContainer> and place <ParallaxLayer> children
 * inside to get scroll-linked transforms — all sharing one useScroll call.
 *
 * Usage:
 *   <ParallaxContainer className="relative overflow-hidden min-h-[60vh]">
 *     <ParallaxLayer speed={-60}  className="absolute inset-0">background</ParallaxLayer>
 *     <ParallaxLayer speed={-120} className="relative z-10">foreground</ParallaxLayer>
 *   </ParallaxContainer>
 */

import { createContext, useContext, useRef } from "react";
import { motion, useScroll, useTransform, motionValue, type MotionValue } from "framer-motion";

/* Module-level zero-progress fallback so ParallaxLayer's hooks always run */
const ZERO = motionValue(0);

const ParallaxCtx = createContext<MotionValue<number>>(ZERO);

// ─── ParallaxContainer ─────────────────────────────────────────────────────
interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function ParallaxContainer({ children, className = "" }: ContainerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    return (
        <ParallaxCtx.Provider value={scrollYProgress}>
            <div ref={ref} className={className}>
                {children}
            </div>
        </ParallaxCtx.Provider>
    );
}

// ─── ParallaxLayer ─────────────────────────────────────────────────────────
interface LayerProps {
    children?: React.ReactNode;
    /** Y pixels to travel from 0% → 100% scroll. Negative = moves up. Default -100 */
    speed?: number;
    /** Scale at 100% scroll. 1 = no change. Default 1 */
    scale?: number;
    /** Opacity at 100% scroll. Omit = no change. */
    opacity?: number;
    className?: string;
}

export function ParallaxLayer({
    children,
    speed = -100,
    scale = 1,
    opacity,
    className = "",
}: LayerProps) {
    const scrollP = useContext(ParallaxCtx);

    /* Always call hooks unconditionally — framer-motion requires this */
    const y = useTransform(scrollP, [0, 1], [0, speed]);
    const s = useTransform(scrollP, [0, 1], [1, scale]);
    const o = useTransform(scrollP, [0, 1], [1, opacity ?? 1]);

    const style: Record<string, MotionValue<number>> = { y };
    if (scale !== 1)        style.scale   = s;
    if (opacity !== undefined) style.opacity = o;

    return (
        <motion.div style={style} className={className}>
            {children}
        </motion.div>
    );
}
