import type { Metadata } from "next";
import Link from "next/link";
import MiniHero from "@/components/MiniHero";
import FadeIn from "@/components/FadeIn";
import { PersonSchema, BreadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
    title: "About",
    description:
        "Who is Breanzy? Brean Julius Carbonilla is a Filipino full-stack software developer based in Melbourne, writing down-to-earth takes on the tech industry.",
};

const STACK = ["Next.js", "TypeScript", "Firebase", "Neon", "Upstash", "shadcn/ui", "Vercel"];

export default function AboutPage() {
    return (
        <main className="bg-black min-h-screen">
            <PersonSchema />
            <BreadcrumbSchema
                items={[
                    { name: "Home", path: "/" },
                    { name: "About", path: "/about" },
                ]}
            />

            <MiniHero
                eyebrow="whoami"
                title="ABOUT."
                accentWord="ABOUT"
                subtitle="who breanzy is, what i build, and why i write."
            />

            <div className="max-w-3xl mx-auto px-4 py-16 space-y-14">
                <FadeIn>
                    <h2 className="text-white text-2xl font-semibold mb-4">Who is Breanzy?</h2>
                    <div className="text-neutral-300 leading-relaxed space-y-4">
                        <p>
                            <strong className="text-white">Breanzy</strong> is <strong className="text-white">Brean Julius Carbonilla</strong> — a Filipino
                            full-stack software developer now based in <strong className="text-white">Melbourne, Australia</strong>. &ldquo;Breanzy&rdquo;
                            started as an in-game handle — Brean&apos;s name is uncommon enough on its own, so adding &ldquo;zy&rdquo; made it instantly
                            distinctive. Over time it stopped being just a username and became the brand this whole site is built around.
                        </p>
                        <p>
                            I&apos;m currently finishing my studies and graduating soon, while doing freelance software development for small and
                            medium-sized organizations and universities. I call myself a jack of all trades — full-stack, curious, and usually
                            learning something random on the side.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.05}>
                    <h2 className="text-white text-2xl font-semibold mb-4">What I build</h2>
                    <p className="text-neutral-300 leading-relaxed mb-5">
                        Most of my work is full-stack web development — from client freelance projects to personal tools and experiments.
                        The stack I reach for most often:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {STACK.map((tech) => (
                            <span
                                key={tech}
                                className="text-xs bg-blue-950/60 text-blue-400 border border-blue-900 px-3 py-1 rounded-full"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                    <p className="text-neutral-400 mt-6">
                        See the full list of what I&apos;ve shipped on the{" "}
                        <Link href="/projects" className="text-blue-400 hover:underline">
                            projects page
                        </Link>
                        .
                    </p>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <h2 className="text-white text-2xl font-semibold mb-4">Why I write</h2>
                    <p className="text-neutral-300 leading-relaxed">
                        The <Link href="/blog" className="text-blue-400 hover:underline">Breanzy blog</Link> is where I write down-to-earth takes
                        on the tech industry — from the perspective of a developer who&apos;s genuinely struggling to keep up with how fast things
                        move. No corporate speak, no thought-leadership tone. Just the kind of casual, honest conversation I&apos;d have with
                        another dev who gets it.
                    </p>
                </FadeIn>

                <FadeIn delay={0.15}>
                    <h2 className="text-white text-2xl font-semibold mb-4">Elsewhere</h2>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <a href="https://github.com/Breanzy" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-blue-400 transition-colors">
                            GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/juliuscarbonilla/" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-blue-400 transition-colors">
                            LinkedIn
                        </a>
                        <a href="https://x.com/Breanzyy" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-blue-400 transition-colors">
                            Twitter / X
                        </a>
                    </div>
                </FadeIn>
            </div>
        </main>
    );
}
