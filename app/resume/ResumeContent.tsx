"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";

const skills = {
    Languages: ["JavaScript", "HTML", "CSS", "Python"],
    Frameworks: ["React", "Node.js", "Express", "Tailwind CSS"],
    Tools: ["Git", "MongoDB", "Firebase", "Vite", "Redux"],
};

const experience = [
    {
        role: "Full-Stack Developer (Personal Projects)",
        company: "Self-directed",
        dates: "2023 – Present",
        bullets: [
            "Built a full-stack personal website using the MERN stack with JWT auth and Firebase OAuth.",
            "Implemented admin dashboard with CRUD for posts, projects, users, and comments.",
            "Integrated Firebase Storage for image uploads and Redux Toolkit for state management.",
        ],
    },
];

const education = [
    {
        school: "Your School / Bootcamp Name",
        degree: "Degree or Program Name",
        dates: "Year – Year",
    },
];

const badgeVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};
const badgeItem = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 15 } },
};

export default function ResumeContent() {
    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-3xl mx-auto px-4 py-16">
                <FadeIn className="flex items-start justify-between flex-wrap gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Resume</h1>
                        <p className="text-neutral-500 text-sm mt-1">
                            Brean Julius Carbonilla · Full-Stack Developer
                        </p>
                    </div>
                    <motion.a
                        href="#"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                        className="border border-neutral-700 hover:border-blue-600 text-neutral-300 hover:text-white text-sm px-5 py-2 rounded-lg transition-colors"
                    >
                        Download PDF
                    </motion.a>
                </FadeIn>

                {/* Skills */}
                <FadeIn delay={0.05}>
                    <section className="mb-12">
                        <h2 className="text-white font-semibold text-lg mb-5 pb-2 border-b border-neutral-800">
                            Skills
                        </h2>
                        <div className="flex flex-col gap-4">
                            {Object.entries(skills).map(([group, items], gi) => (
                                <div key={group} className="flex flex-wrap items-center gap-2">
                                    <span className="text-neutral-500 text-sm w-24 shrink-0">{group}</span>
                                    <motion.div
                                        className="flex flex-wrap gap-2"
                                        variants={badgeVariants}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true }}
                                        custom={gi}
                                    >
                                        {items.map((skill) => (
                                            <motion.span
                                                key={skill}
                                                variants={badgeItem}
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                                                className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-0.5 rounded-full cursor-default"
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </section>
                </FadeIn>

                {/* Experience */}
                <section className="mb-12">
                    <FadeIn>
                        <h2 className="text-white font-semibold text-lg mb-5 pb-2 border-b border-neutral-800">
                            Experience
                        </h2>
                    </FadeIn>
                    <div className="flex flex-col gap-8">
                        {experience.map((job, i) => (
                            <FadeIn key={job.role} delay={i * 0.1}>
                                <div>
                                    <div className="flex justify-between flex-wrap gap-1 mb-1">
                                        <h3 className="text-white font-medium">{job.role}</h3>
                                        <span className="text-neutral-500 text-sm">{job.dates}</span>
                                    </div>
                                    <p className="text-blue-500 text-sm mb-3">{job.company}</p>
                                    <ul className="flex flex-col gap-1.5">
                                        {job.bullets.map((b) => (
                                            <li key={b} className="text-neutral-400 text-sm flex gap-2">
                                                <span className="text-blue-600 mt-1 shrink-0">–</span>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section>
                    <FadeIn>
                        <h2 className="text-white font-semibold text-lg mb-5 pb-2 border-b border-neutral-800">
                            Education
                        </h2>
                    </FadeIn>
                    <div className="flex flex-col gap-4">
                        {education.map((edu, i) => (
                            <FadeIn key={edu.school} delay={i * 0.1}>
                                <div>
                                    <div className="flex justify-between flex-wrap gap-1">
                                        <h3 className="text-white font-medium">{edu.school}</h3>
                                        <span className="text-neutral-500 text-sm">{edu.dates}</span>
                                    </div>
                                    <p className="text-neutral-400 text-sm">{edu.degree}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
