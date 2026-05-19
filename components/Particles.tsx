"use client";

import { useMemo } from "react";

interface ParticlesProps {
    count?: number;
}

/** Gently drifting accent-coloured dust particles floating upward. */
export default function Particles({ count = 14 }: ParticlesProps) {
    const dots = useMemo(
        () =>
            Array.from({ length: count }, () => ({
                left: Math.random() * 100,
                bottom: -10 - Math.random() * 30,
                size: 1 + Math.random() * 2.2,
                dur: 9 + Math.random() * 12,
                delay: -Math.random() * 14,
                drift: -30 + Math.random() * 60,
                op: 0.25 + Math.random() * 0.35,
            })),
        [count]
    );

    return (
        <div
            aria-hidden
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 3 }}
        >
            {dots.map((d, i) => (
                <span
                    key={i}
                    className="particle"
                    style={{
                        left: d.left + "%",
                        bottom: d.bottom + "%",
                        width: d.size,
                        height: d.size,
                        ["--p-dur" as any]: d.dur + "s",
                        ["--p-delay" as any]: d.delay + "s",
                        ["--p-drift" as any]: d.drift + "px",
                        ["--p-opacity" as any]: d.op,
                        animationDelay: d.delay + "s",
                    }}
                />
            ))}
        </div>
    );
}
