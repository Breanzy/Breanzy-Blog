import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");

    // Fetch all projects on mount
    useEffect(() => {
        const fetchProjects = async () => {
            const res = await fetch("/api/project/getprojects");
            const data = await res.json();
            if (res.ok) setProjects(data.projects);
        };
        fetchProjects();
    }, []);

    // Derive unique categories from fetched project data
    const categories = [
        "all",
        ...new Set(projects.map((p) => p.category).filter((c) => c !== "uncategorized")),
    ];

    const filtered =
        activeCategory === "all"
            ? projects
            : projects.filter((p) => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-6xl mx-auto px-4 py-20">
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">Projects</h1>
                <p className="text-neutral-400 text-base max-w-xl mb-10">
                    A collection of things I've built — from full-stack web apps
                    to tools and experiments.
                </p>

                {/* Category filter buttons */}
                {categories.length > 1 && (
                    <div className="flex flex-wrap gap-2 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm border transition-all capitalize ${
                                    activeCategory === cat
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Project grid */}
                {filtered.length > 0 ? (
                    <div className="flex flex-wrap gap-4 justify-center">
                        {filtered.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-600 py-12 text-center">
                        No projects to show yet.
                    </p>
                )}
            </div>
        </div>
    );
}
