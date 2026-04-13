"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import FadeIn from "@/components/FadeIn";

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};
const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80, damping: 15 } },
};

interface ProjectsClientProps {
    projects: any[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
    const [activeCategory, setActiveCategory] = useState("all");

    const categories = [
        "all",
        ...new Set(projects.map((p) => p.category).filter((c) => c !== "uncategorized")),
    ];

    const filtered = activeCategory === "all"
        ? projects
        : projects.filter((p) => p.category === activeCategory);

    return (
        <>
            {/* Category filter */}
            {categories.length > 1 && (
                <FadeIn delay={0.1} className="mb-10">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                                className={`relative px-4 py-1.5 rounded-full text-sm border transition-colors capitalize ${
                                    activeCategory === cat
                                        ? "text-white border-blue-600"
                                        : "border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white"
                                }`}
                            >
                                {activeCategory === cat && (
                                    <motion.span
                                        layoutId="filter-pill"
                                        className="absolute inset-0 bg-blue-600 rounded-full"
                                        transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                                    />
                                )}
                                <span className="relative z-10">{cat}</span>
                            </motion.button>
                        ))}
                    </div>
                </FadeIn>
            )}

            {/* Grid */}
            <AnimatePresence mode="wait">
                {filtered.length > 0 ? (
                    <motion.div
                        key={activeCategory}
                        className="flex flex-wrap gap-4 justify-center"
                        variants={gridVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {filtered.map((project) => (
                            <motion.div key={project._id} variants={cardVariant}>
                                <ProjectCard project={project} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.p
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-neutral-600 py-12 text-center"
                    >
                        No projects to show yet.
                    </motion.p>
                )}
            </AnimatePresence>
        </>
    );
}
