"use client";

import Image from "next/image";
import { BsGithub } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface ProjectCardProps {
    project: {
        _id: string;
        title: string;
        description: string;
        image?: string;
        techStack?: string[];
        liveUrl?: string;
        repoUrl?: string;
    };
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <motion.div
            className="w-full sm:w-[430px] bg-neutral-900 border border-neutral-800 overflow-hidden rounded-xl"
            whileHover={{ scale: 1.03, y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.6)", borderColor: "#2563eb" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
        >
            {project.image && (
                <motion.div
                    className="relative h-[220px] w-full overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring" as const, stiffness: 200, damping: 25 }}
                >
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 430px"
                    />
                </motion.div>
            )}
            <div className="p-4 flex flex-col gap-2">
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
                                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                                className="text-xs bg-blue-950/60 text-blue-400 border border-blue-900 px-2 py-0.5 rounded-full cursor-default"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </motion.div>
                )}

                <div className="flex gap-4 mt-2">
                    {project.liveUrl && (
                        <motion.a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                        >
                            <FaExternalLinkAlt className="text-xs" />
                            Live Demo
                        </motion.a>
                    )}
                    {project.repoUrl && (
                        <motion.a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                        >
                            <BsGithub />
                            Repo
                        </motion.a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
