"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeIn from "./FadeIn";

interface ParallaxHeroProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

export default function ParallaxHero({ title, subtitle, children }: ParallaxHeroProps) {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div ref={heroRef} className="relative overflow-hidden pt-20 pb-24">
            <motion.div style={{ y }} className="relative z-10 max-w-6xl mx-auto px-4">
                <FadeIn>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">{title}</h1>
                    <p className="text-neutral-400 text-base max-w-xl">{subtitle}</p>
                    {children}
                </FadeIn>
            </motion.div>
        </div>
    );
}
