"use client";

import { useEffect, useRef } from "react";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
    tilt?: boolean;
    [key: string]: any;
}

/**
 * Matte glass card.
 * - Cursor-tracked spotlight glow on hover
 * - Optional 3D tilt (perspective rotateX/Y) on mouse move
 */
export default function GlassCard({
    children,
    className = "",
    interactive = true,
    tilt = true,
    ...rest
}: GlassCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || !interactive) return;
        const el = ref.current;
        let raf: number;

        const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const xFrac = (e.clientX - r.left) / r.width;   // 0→1
            const yFrac = (e.clientY - r.top)  / r.height;  // 0→1

            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                // Spotlight
                el.style.setProperty("--mx", xFrac * 100 + "%");
                el.style.setProperty("--my", yFrac * 100 + "%");

                // 3D tilt — max ±18°
                if (tilt) {
                    const rotX = (yFrac - 0.5) * -18;
                    const rotY = (xFrac - 0.5) *  18;
                    const scaleVal = 1.04;
                    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scaleVal}) translateZ(10px)`;
                }
            });
        };

        const onEnter = () => el.style.setProperty("--spot-op", "1");

        const onLeave = () => {
            el.style.setProperty("--spot-op", "0");
            if (tilt) {
                el.style.transform = "";
            }
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        return () => {
            cancelAnimationFrame(raf);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerenter", onEnter);
            el.removeEventListener("pointerleave", onLeave);
        };
    }, [interactive, tilt]);

    return (
        <div
            ref={ref}
            className={`glass glass-hover relative rounded-2xl overflow-hidden ${className}`}
            style={{
                transition: "border-color .4s var(--ease-out), box-shadow .4s var(--ease-out), transform .15s ease-out",
                willChange: "transform",
            }}
            {...rest}
        >
            {children}
        </div>
    );
}
