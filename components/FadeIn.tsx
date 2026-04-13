"use client";

import { motion } from "framer-motion";

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    y?: number;
    className?: string;
}

/* Reusable scroll-triggered reveal */
export default function FadeIn({ children, delay = 0, y = 40, className = "" }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring" as const, stiffness: 80, damping: 15, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
