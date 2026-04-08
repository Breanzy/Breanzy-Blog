import { Badge } from "flowbite-react";
import { BsGithub } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";

// Card for displaying a single project with tech stack badges and external links
export default function ProjectCard({ project }) {
    return (
        <div className="group relative w-full border border-teal-500 hover:border-2 transition-all overflow-hidden rounded-lg sm:w-[430px]">
            {project.image && (
                <img
                    src={project.image}
                    alt={project.title}
                    className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300"
                />
            )}
            <div className="p-3 flex flex-col gap-2">
                <p className="text-lg font-semibold line-clamp-2">
                    {project.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {project.description}
                </p>

                {/* Tech stack badges */}
                {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {project.techStack.map((tech) => (
                            <Badge key={tech} color="indigo" className="text-xs">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* External links: live demo and repo */}
                <div className="flex gap-3 mt-2">
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-teal-500 hover:underline"
                        >
                            <FaExternalLinkAlt />
                            Live Demo
                        </a>
                    )}
                    {project.repoUrl && (
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:underline"
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
