import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";
import MiniHero from "@/components/MiniHero";
import ProjectsClient from "./ProjectsClient";
import { BreadcrumbSchema, ItemListSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
    title: "Projects",
    description: "A collection of full-stack web apps, tools, and experiments built by Breanzy (Brean Julius Carbonilla), a full-stack developer based in Melbourne.",
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
        <div style={{ background: "var(--ink-0)" }}>
            <BreadcrumbSchema
                items={[
                    { name: "Home", path: "/" },
                    { name: "Projects", path: "/projects" },
                ]}
            />
            {projects.length > 0 && (
                <ItemListSchema
                    items={projects.map((p: any) => ({ name: p.title, path: `/projects/${p.slug}` }))}
                />
            )}
            <MiniHero
                eyebrow="ls ./projects"
                title="PROJECTS."
                accentWord="PROJECTS"
                subtitle="a collection of things i've built — from full-stack web apps to tools and experiments."
            />
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <ProjectsClient projects={projects} />
            </div>
        </div>
    );
}
