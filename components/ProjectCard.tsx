"use client";

import Link from "next/link";
import Image from "next/image";
import { BsGithub } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import GlassCard from "@/components/GlassCard";
import MatrixRain from "@/components/MatrixRain";

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

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/projects/${project.slug}`} className="group block w-full sm:w-[430px]">
            <GlassCard className="flex flex-col w-full">
                {/* Cover */}
                <div
                    className="cover-frame relative h-48 overflow-hidden"
                    style={{ borderBottom: "1px solid var(--hairline)" }}
                >
                    <div className="absolute inset-0" style={{ background: "#060e1f" }} />
                    <MatrixRain density={0.35} intensity={0.45} />
                    <div aria-hidden className="cover-grid" />
                    <div
                        aria-hidden
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(-45deg, rgba(80,140,230,0.06) 0 2px, transparent 2px 12px)",
                        }}
                    />
                    {project.image ? (
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover opacity-60"
                            sizes="(max-width: 640px) 100vw, 430px"
                        />
                    ) : (
                        <div className="absolute inset-0 grid place-items-center">
                            <span
                                className="cover-emoji-wrap float-y slow text-6xl opacity-90"
                                style={{ filter: "drop-shadow(0 0 20px rgba(80,140,230,0.4))" }}
                            >
                                🛠️
                            </span>
                        </div>
                    )}
                    <span
                        className="absolute top-3 right-3 text-[11px] text-neutral-300 px-2 py-1 rounded inline-flex items-center gap-1.5"
                        style={{ background: "rgba(3,5,12,0.7)", border: "1px solid var(--hairline)" }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        live
                    </span>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-serif font-bold text-white text-lg tracking-tight mb-1.5 uppercase">
                        {project.title}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 mb-4">
                        {project.description}
                    </p>

                    {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.techStack.map((t) => (
                                <span
                                    key={t}
                                    className="font-mono text-[10px] px-2 py-0.5 rounded text-neutral-400"
                                    style={{ background: "var(--ink-1)", border: "1px solid var(--hairline)" }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}

                    <div
                        className="mt-auto flex items-center justify-between text-xs pt-3"
                        style={{ borderTop: "1px solid var(--hairline)" }}
                    >
                        {project.liveUrl ? (
                            <span
                                role="link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                                }}
                                className="inline-flex items-center gap-1.5 font-mono cursor-pointer transition-colors"
                                style={{ color: "rgb(80 140 230)" }}
                            >
                                <FaExternalLinkAlt className="text-[10px]" /> live demo
                            </span>
                        ) : (
                            <span style={{ color: "rgb(80 140 230)" }} className="font-mono">
                                ↗ view project
                            </span>
                        )}
                        {project.repoUrl && (
                            <span
                                role="link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(project.repoUrl, "_blank", "noopener,noreferrer");
                                }}
                                className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-white transition-colors font-mono cursor-pointer"
                            >
                                <BsGithub /> repo
                            </span>
                        )}
                    </div>
                </div>
            </GlassCard>
        </Link>
    );
}
