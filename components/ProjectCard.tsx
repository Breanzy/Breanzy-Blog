"use client";

import Link from "next/link";
import Image from "next/image";
import { BsGithub } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";

interface ProjectCardProps {
    project: {
        _id: string;
        slug: string;
        title: string;
        description: string;
        image?: string;
        techStack?: string[];
        liveUrl?: string;
        repoUrl?: string;
    };
}

const card = {
    idle:    { scale: 1,    y: 0,  boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 10px rgba(255,255,255,0.18), 0 0 35px rgba(255,255,255,0.06), inset 0 1.5px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(255,255,255,0.1), inset 0 0 14px rgba(255,255,255,0.04)" },
    hovered: { scale: 1.03, y: -8, boxShadow: "0 28px 56px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.25), 0 0 50px rgba(255,255,255,0.08), inset 0 1.5px 0 rgba(255,255,255,0.8)" },
};

const imageWrap = {
    idle:    { scale: 1 },
    hovered: { scale: 1.05 },
};

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/projects/${project.slug}`} className="block w-full sm:w-[430px]">
            {/* TiltCard owns the 3D perspective + glare overlay */}
            <TiltCard className="w-full rounded-xl">
                {/* motion.div owns hover-state and propagates it via named variants */}
                <motion.div
                    className="glass-card w-full rounded-xl overflow-hidden"
                    variants={card}
                    initial="idle"
                    whileHover="hovered"
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    {project.image && (
                        <div className="relative h-[220px] w-full overflow-hidden">
                            <motion.div
                                className="relative w-full h-full"
                                variants={imageWrap}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            >
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, 430px"
                                />
                            </motion.div>
                        </div>
                    )}

                    <div className="p-4 flex flex-col gap-2">
                        <span className="text-blue-400 text-xs uppercase tracking-[0.14em]">Case study</span>
                        <p className="text-white text-lg font-semibold line-clamp-2">{project.title}</p>
                        <p className="text-neutral-400 text-sm line-clamp-2">{project.description}</p>

                        {project.techStack && project.techStack.length > 0 && (
                            <motion.div
                                className="flex flex-wrap gap-1.5 mt-1"
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                            >
                                {project.techStack.map((tech) => (
                                    <motion.span
                                        key={tech}
                                        variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="text-xs bg-blue-950/60 text-blue-400 border border-blue-900 px-2 py-0.5 rounded-full cursor-default"
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                            </motion.div>
                        )}

                        <div className="flex gap-4 mt-2">
                            {project.liveUrl && (
                                <motion.span
                                    role="link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                                    }}
                                    className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                                    whileHover={{ x: 3 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <FaExternalLinkAlt className="text-xs" />
                                    Live Demo
                                </motion.span>
                            )}
                            <span className="text-sm text-blue-400">View case study</span>
                            {project.repoUrl && (
                                <motion.span
                                    role="link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.open(project.repoUrl, "_blank", "noopener,noreferrer");
                                    }}
                                    className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                    whileHover={{ x: 3 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <BsGithub />
                                    Repo
                                </motion.span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </TiltCard>
        </Link>
    );
}
