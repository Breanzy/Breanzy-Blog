import type { Metadata } from "next";
import Link from "next/link";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { HiOutlineBriefcase, HiOutlineChatAlt2, HiOutlineLightBulb, HiOutlineMail } from "react-icons/hi";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
    title: "Contact",
    description: "Contact Brean Julius Carbonilla for work, collaborations, project questions, or a quick hello.",
};

const email = "hello@breanzy.com";

const intents = [
    {
        label: "Hire me",
        description: "For roles, freelance work, or project-based opportunities.",
        icon: HiOutlineBriefcase,
        href: `mailto:${email}?subject=Work%20opportunity%20for%20Breanzy`,
    },
    {
        label: "Collaborate",
        description: "For building something together or exploring an idea.",
        icon: HiOutlineLightBulb,
        href: `mailto:${email}?subject=Collaboration%20idea`,
    },
    {
        label: "Ask about a project",
        description: "For questions about a build, stack choice, or case study.",
        icon: HiOutlineChatAlt2,
        href: `mailto:${email}?subject=Question%20about%20your%20project`,
    },
    {
        label: "Just say hi",
        description: "For anything more casual.",
        icon: HiOutlineMail,
        href: `mailto:${email}?subject=Hello%20Breanzy`,
    },
];

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black">
            <div className="max-w-4xl mx-auto px-4 py-20">
                <FadeIn>
                    <p className="text-blue-500 text-sm font-medium mb-3">Contact</p>
                    <h1 className="text-4xl font-bold text-white mb-4">Let's make the message easier to send</h1>
                    <p className="text-neutral-400 leading-relaxed max-w-2xl">
                        Pick the reason that fits best and your email app will open with a useful subject line.
                    </p>
                </FadeIn>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {intents.map((intent, index) => {
                        const Icon = intent.icon;
                        return (
                            <FadeIn key={intent.label} delay={index * 0.06}>
                                <a href={intent.href} className="group block border border-neutral-800 bg-neutral-950/60 rounded-xl p-5 hover:border-blue-700 transition-colors h-full">
                                    <Icon className="text-blue-500 text-xl mb-4" />
                                    <h2 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">{intent.label}</h2>
                                    <p className="text-neutral-500 text-sm leading-relaxed">{intent.description}</p>
                                </a>
                            </FadeIn>
                        );
                    })}
                </div>

                <FadeIn delay={0.25} className="mt-10 flex flex-wrap gap-3">
                    <Link href="https://github.com/Breanzy" target="_blank" className="inline-flex items-center gap-2 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 rounded-lg px-4 py-2 text-sm transition-colors">
                        <BsGithub /> GitHub
                    </Link>
                    <Link href="https://www.linkedin.com/in/juliuscarbonilla/" target="_blank" className="inline-flex items-center gap-2 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 rounded-lg px-4 py-2 text-sm transition-colors">
                        <BsLinkedin /> LinkedIn
                    </Link>
                </FadeIn>
            </div>
        </main>
    );
}
