"use client";

import { motion } from "framer-motion";

type FadeVariant = "up" | "down" | "left" | "right" | "scale" | "rotate";

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    /** Legacy y-offset shortcut — ignored when variant is set */
    y?: number;
    className?: string;
    variant?: FadeVariant;
    /** Override spring stiffness */
    stiffness?: number;
    /** Override spring damping */
    damping?: number;
}

const variantMap: Record<FadeVariant, { initial: object; animate: object }> = {
    up:     { initial: { opacity: 0, y: 40 },           animate: { opacity: 1, y: 0 } },
    down:   { initial: { opacity: 0, y: -40 },          animate: { opacity: 1, y: 0 } },
    left:   { initial: { opacity: 0, x: -40 },          animate: { opacity: 1, x: 0 } },
    right:  { initial: { opacity: 0, x: 40 },           animate: { opacity: 1, x: 0 } },
    scale:  { initial: { opacity: 0, scale: 0.88 },     animate: { opacity: 1, scale: 1 } },
    rotate: { initial: { opacity: 0, rotate: -6, y: 20 }, animate: { opacity: 1, rotate: 0, y: 0 } },
};

/** Scroll-triggered reveal with configurable entry direction. */
export default function FadeIn({
    children,
    delay = 0,
    y = 40,
    className = "",
    variant,
    stiffness = 80,
    damping = 15,
}: FadeInProps) {
    const chosen = variant
        ? variantMap[variant]
        : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 } };

    return (
        <motion.div
            initial={chosen.initial as any}
            whileInView={chosen.animate as any}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness, damping, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
