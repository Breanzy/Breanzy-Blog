import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import Project from "@/models/project.model";
import ProjectPageHero from "@/components/ProjectPageHero";
import FadeIn from "@/components/FadeIn";
import { BreadcrumbSchema, ProjectSchema } from "@/components/JsonLd";

const getProject = unstable_cache(
    async (slug: string) => {
        await connectDB();
        const project = await Project.findOne({ slug }).lean();
        return project ? JSON.parse(JSON.stringify(project)) : null;
    },
    ["project-by-slug"],
    { tags: ["projects"], revalidate: false }
);

// Fetches the immediately older and newer project by updatedAt
const getAdjacentProjects = unstable_cache(
    async (slug: string) => {
        await connectDB();
        const current = await Project.findOne({ slug }).select("updatedAt").lean() as any;
        if (!current) return { prev: null, next: null };
        const [prev, next] = await Promise.all([
            Project.findOne({ updatedAt: { $lt: current.updatedAt } })
                .sort({ updatedAt: -1 })
                .select("title slug image")
                .lean(),
            Project.findOne({ updatedAt: { $gt: current.updatedAt } })
                .sort({ updatedAt: 1 })
                .select("title slug image")
                .lean(),
        ]);
        return {
            prev: prev ? JSON.parse(JSON.stringify(prev)) : null,
            next: next ? JSON.parse(JSON.stringify(next)) : null,
        };
    },
    ["project-adjacent"],
    { tags: ["projects"], revalidate: false }
);

export async function generateStaticParams() {
    await connectDB();
    const projects = await Project.find({}, "slug").lean();
    return (projects as any[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) return {};
    return {
        title: project.title,
        description: project.description || undefined,
        openGraph: {
            title: project.title,
            description: project.description || undefined,
            type: "website",
            images: project.image ? [project.image] : undefined,
            url: `/projects/${project.slug}`,
        },
        twitter: { card: "summary_large_image" },
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [project, { prev, next }] = await Promise.all([
        getProject(slug),
        getAdjacentProjects(slug),
    ]);

    if (!project) notFound();

    return (
        <main className="min-h-screen">
            <BreadcrumbSchema
                items={[
                    { name: "Home", path: "/" },
                    { name: "Projects", path: "/projects" },
                    { name: project.title, path: `/projects/${project.slug}` },
                ]}
            />
            <ProjectSchema
                title={project.title}
                description={project.description}
                image={project.image}
                slug={project.slug}
                techStack={project.techStack}
                liveUrl={project.liveUrl}
                repoUrl={project.repoUrl}
                createdAt={project.createdAt}
                updatedAt={project.updatedAt}
            />
            <ProjectPageHero
                title={project.title}
                image={project.image}
                techStack={project.techStack}
                liveUrl={project.liveUrl}
                repoUrl={project.repoUrl}
            />

            <section className="max-w-4xl mx-auto px-4 pt-12">
                <FadeIn>
                    <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr] border-b border-white/[0.06] pb-10">
                        <div>
                            <p className="text-blue-500 text-sm font-medium mb-3">Case Study</p>
                            <h2 className="text-white text-2xl font-semibold mb-4">What this project is about</h2>
                            <p className="text-neutral-400 leading-relaxed">{project.description}</p>
                        </div>
                        <div className="flex flex-col gap-3 text-sm">
                            <div className="border border-neutral-800 rounded-xl p-4">
                                <p className="text-neutral-500 mb-1">Category</p>
                                <p className="text-white capitalize">{project.category}</p>
                            </div>
                            <div className="border border-neutral-800 rounded-xl p-4">
                                <p className="text-neutral-500 mb-1">Focus</p>
                                <p className="text-white">Build decisions, implementation notes, and lessons learned.</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* Rich content */}
            {project.content && (
                <div className="max-w-3xl mx-auto px-4 pt-12 pb-20">
                    <FadeIn>
                        <div
                            className="post-content text-neutral-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: project.content }}
                        />
                    </FadeIn>
                </div>
            )}

            {/* Prev / Next navigation */}
            {(prev || next) && (
                <div className="max-w-4xl mx-auto px-4 pb-16">
                    <div className="border-t border-white/[0.06] pt-10 grid grid-cols-2 gap-4">
                        {/* Older project — left */}
                        {prev ? (
                            <Link href={`/projects/${prev.slug}`} className="group glass-card rounded-xl overflow-hidden flex flex-col">
                                {prev.image && (
                                    <div className="relative h-28 w-full overflow-hidden">
                                        <Image src={prev.image} alt={prev.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="50vw" />
                                        <div className="absolute inset-0 bg-black/40" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <p className="text-neutral-500 text-xs mb-1">← Previous</p>
                                    <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">{prev.title}</p>
                                </div>
                            </Link>
                        ) : <div />}

                        {/* Newer project — right */}
                        {next ? (
                            <Link href={`/projects/${next.slug}`} className="group glass-card rounded-xl overflow-hidden flex flex-col text-right">
                                {next.image && (
                                    <div className="relative h-28 w-full overflow-hidden">
                                        <Image src={next.image} alt={next.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="50vw" />
                                        <div className="absolute inset-0 bg-black/40" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <p className="text-neutral-500 text-xs mb-1">Next →</p>
                                    <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">{next.title}</p>
                                </div>
                            </Link>
                        ) : <div />}
                    </div>
                </div>
            )}
        </main>
    );
}
