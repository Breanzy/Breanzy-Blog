import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
    title: "Now",
    description: "What Brean Julius Carbonilla is currently building, learning, and focusing on.",
};

const current = [
    {
        label: "Building",
        items: ["Polishing this personal site into a sharper portfolio and writing space.", "Improving newsletter and blog workflows so publishing feels lighter."],
    },
    {
        label: "Learning",
        items: ["Deeper Next.js App Router patterns.", "Better product thinking around small tools and personal software."],
    },
    {
        label: "Focusing",
        items: ["Shipping small improvements consistently.", "Turning projects into clearer case studies instead of just screenshots."],
    },
];

export default function NowPage() {
    return (
        <main className="min-h-screen bg-black">
            <div className="max-w-3xl mx-auto px-4 py-20">
                <FadeIn>
                    <p className="text-blue-500 text-sm font-medium mb-3">Now</p>
                    <h1 className="text-4xl font-bold text-white mb-4">What I'm up to lately</h1>
                    <p className="text-neutral-400 leading-relaxed">
                        A small snapshot of what has my attention right now. Less formal than a resume, more current than an about page.
                    </p>
                </FadeIn>

                <div className="mt-12 flex flex-col gap-10">
                    {current.map((section, index) => (
                        <FadeIn key={section.label} delay={index * 0.08}>
                            <section className="border-t border-neutral-800 pt-6">
                                <h2 className="text-white text-lg font-semibold mb-4">{section.label}</h2>
                                <ul className="flex flex-col gap-3">
                                    {section.items.map((item) => (
                                        <li key={item} className="text-neutral-400 leading-relaxed">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </main>
    );
}
