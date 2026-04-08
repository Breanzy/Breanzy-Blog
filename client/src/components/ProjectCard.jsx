import { BsGithub } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";

/* Card for displaying a single project with tech stack badges and external links */
export default function ProjectCard({ project }) {
    return (
        <div className="group w-full sm:w-[430px] bg-neutral-900 border border-neutral-800 hover:border-blue-600 transition-all overflow-hidden rounded-xl">
            {project.image && (
                <img
                    src={project.image}
                    alt={project.title}
                    className="h-[220px] w-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                />
            )}
            <div className="p-4 flex flex-col gap-2">
                <p className="text-white text-lg font-semibold line-clamp-2">{project.title}</p>
                <p className="text-neutral-400 text-sm line-clamp-2">{project.description}</p>

                {/* Tech stack badges */}
                {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {project.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="text-xs bg-blue-950/60 text-blue-400 border border-blue-900 px-2 py-0.5 rounded-full"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                {/* External links */}
                <div className="flex gap-4 mt-2">
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <FaExternalLinkAlt className="text-xs" />
                            Live Demo
                        </a>
                    )}
                    {project.repoUrl && (
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
                        >
                            <BsGithub />
                            Repo
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
