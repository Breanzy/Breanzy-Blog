import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
    title: "About",
    description: "I'm Brean Julius Carbonilla — a full-stack developer based in the Philippines. I build web apps and write about what I learn.",
};

export default function AboutPage() {
    return <AboutContent />;
}
