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
            if (res.ok) {
                setProjects(data.projects);
            }
        };
        fetchProjects();
    }, []);

    // Derive unique categories from fetched projects for filter buttons
    const categories = [
        "all",
        ...new Set(projects.map((p) => p.category).filter((c) => c !== "uncategorized")),
    ];

    const filtered =
        activeCategory === "all"
            ? projects
            : projects.filter((p) => p.category === activeCategory);

    return (
        <div className="min-h-screen max-w-6xl mx-auto p-3">
            <div className="flex flex-col gap-6 px-3 py-16 text-center">
                <h1 className="text-3xl font-bold lg:text-6xl">My Projects</h1>
                <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
                    A collection of things I've built — from full-stack web apps
                    to small tools and experiments.
                </p>
            </div>

            {/* Category filter buttons */}
            {categories.length > 1 && (
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm border transition-all capitalize ${
                                activeCategory === cat
                                    ? "bg-teal-500 text-white border-teal-500"
                                    : "border-teal-500 text-teal-500 hover:bg-teal-50 dark:hover:bg-slate-700"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Project grid */}
            {filtered.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center pb-12">
                    {filtered.map((project) => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-12">
                    No projects to show yet.
                </p>
            )}
        </div>
    );
}
