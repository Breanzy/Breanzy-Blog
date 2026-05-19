"use client";

import { useEffect, useRef } from "react";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    interactive?: boolean;
    [key: string]: any;
}

/** Matte glass card with cursor-tracked spotlight on hover. */
export default function GlassCard({ children, className = "", interactive = true, ...rest }: GlassCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || !interactive) return;
        const el = ref.current;
        let raf: number;

        const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                el.style.setProperty("--mx", x + "%");
                el.style.setProperty("--my", y + "%");
            });
        };
        const onEnter = () => el.style.setProperty("--spot-op", "1");
        const onLeave = () => el.style.setProperty("--spot-op", "0");

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        return () => {
            cancelAnimationFrame(raf);
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerenter", onEnter);
            el.removeEventListener("pointerleave", onLeave);
        };
    }, [interactive]);

    return (
        <div
            ref={ref}
            className={`glass glass-hover relative rounded-2xl overflow-hidden transition-all duration-300 ${className}`}
            {...rest}
        >
            {children}
        </div>
    );
}
