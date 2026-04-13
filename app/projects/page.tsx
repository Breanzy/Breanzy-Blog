import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";
import FadeIn from "@/components/FadeIn";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
    title: "Projects",
    description: "A collection of full-stack web apps, tools, and experiments built by Brean Julius Carbonilla.",
};

const getProjects = unstable_cache(
    async () => {
        await connectDB();
        const projects = await Project.find().sort({ updatedAt: -1 }).lean();
        return JSON.parse(JSON.stringify(projects));
    },
    ["projects-list"],
    { tags: ["projects"], revalidate: false }
);

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-6xl mx-auto px-4 py-20">
                <FadeIn>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">Projects</h1>
                    <p className="text-neutral-400 text-base max-w-xl mb-10">
                        A collection of things I've built — from full-stack web apps to tools and experiments.
                    </p>
                </FadeIn>
                <ProjectsClient projects={projects} />
            </div>
        </div>
    );
}
