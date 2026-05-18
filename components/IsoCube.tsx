"use client";

/**
 * Isometric SVG cube decoration with a gentle floating animation.
 * Uses 2:1 isometric geometry (three visible faces: top, left, right).
 * Pair multiple cubes at different sizes/positions for a layered hero effect.
 */

import { motion } from "framer-motion";

interface IsoCubeProps {
    size?: number;
    baseColor?: string;
    opacity?: number;
    /** Seconds to delay the float animation, useful for staggering siblings */
    floatDelay?: number;
    className?: string;
}

export default function IsoCube({
    size = 48,
    baseColor = "#2563eb",
    opacity = 0.35,
    floatDelay = 0,
    className = "",
}: IsoCubeProps) {
    const s = size;
    /* 2:1 isometric cube — three visible faces */
    const top   = `${s},0 ${s * 2},${s * 0.5} ${s},${s} 0,${s * 0.5}`;
    const left  = `0,${s * 0.5} ${s},${s} ${s},${s * 2} 0,${s * 1.5}`;
    const right = `${s},${s} ${s * 2},${s * 0.5} ${s * 2},${s * 1.5} ${s},${s * 2}`;

    return (
        <motion.div
            className={`absolute pointer-events-none ${className}`}
            animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
            transition={{
                duration: 7 + floatDelay * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: floatDelay,
            }}
        >
            <svg width={s * 2} height={s * 2} viewBox={`0 0 ${s * 2} ${s * 2}`}>
                <polygon points={top}   fill={baseColor} opacity={opacity * 0.95} />
                <polygon points={left}  fill={baseColor} opacity={opacity * 0.45} />
                <polygon points={right} fill={baseColor} opacity={opacity * 0.65} />
            </svg>
        </motion.div>
    );
}
