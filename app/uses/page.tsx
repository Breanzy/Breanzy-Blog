import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
    title: "Uses",
    description: "The tools, stack, and workflow Brean Julius Carbonilla uses to build for the web.",
};

const groups = [
    {
        title: "Code",
        items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"],
    },
    {
        title: "Workflow",
        items: ["GitHub", "Vercel", "Firebase Storage", "Resend", "Porkbun DNS", "Redux Toolkit"],
    },
    {
        title: "Daily Defaults",
        items: ["VS Code", "Chrome DevTools", "Terminal", "Figma for quick visual checks"],
    },
];

export default function UsesPage() {
    return (
        <main className="min-h-screen bg-black">
            <div className="max-w-4xl mx-auto px-4 py-20">
                <FadeIn>
                    <p className="text-blue-500 text-sm font-medium mb-3">Uses</p>
                    <h1 className="text-4xl font-bold text-white mb-4">Tools I keep coming back to</h1>
                    <p className="text-neutral-400 leading-relaxed max-w-2xl">
                        A practical list of the stack and tools behind this site and the projects I build.
                    </p>
                </FadeIn>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {groups.map((group, index) => (
                        <FadeIn key={group.title} delay={index * 0.08}>
                            <section className="border border-neutral-800 bg-neutral-950/60 rounded-xl p-5 h-full">
                                <h2 className="text-white font-semibold mb-4">{group.title}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {group.items.map((item) => (
                                        <span key={item} className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1 rounded-full">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </main>
    );
}
