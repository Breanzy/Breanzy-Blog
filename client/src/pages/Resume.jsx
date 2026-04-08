import { Badge, Button } from "flowbite-react";

// Skills grouped by type
const skills = {
    Languages: ["JavaScript", "HTML", "CSS", "Python"],
    Frameworks: ["React", "Node.js", "Express", "Tailwind CSS"],
    Tools: ["Git", "MongoDB", "Firebase", "Vite", "Redux"],
};

// Work experience entries
const experience = [
    {
        role: "Full-Stack Developer (Personal Projects)",
        company: "Self-directed",
        dates: "2023 – Present",
        bullets: [
            "Built a full-stack blog & personal website using the MERN stack with JWT auth and Firebase OAuth.",
            "Implemented admin dashboard with CRUD for posts, projects, users, and comments.",
            "Integrated Firebase Storage for image uploads and Redux Toolkit for state management.",
        ],
    },
];

// Education entries
const education = [
    {
        school: "Your School / Bootcamp Name",
        degree: "Degree or Program Name",
        dates: "Year – Year",
    },
];

export default function Resume() {
    return (
        <div className="min-h-screen max-w-3xl mx-auto p-3 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Resume</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Brean Julius Carbonilla · Full-Stack Developer
                    </p>
                </div>
                {/* Placeholder — replace href with your actual PDF URL when ready */}
                <Button gradientDuoTone="purpleToPink" href="#" disabled>
                    Download PDF
                </Button>
            </div>

            {/* Skills */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-600">
                    Skills
                </h2>
                <div className="flex flex-col gap-3">
                    {Object.entries(skills).map(([group, items]) => (
                        <div key={group} className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">
                                {group}
                            </span>
                            {items.map((skill) => (
                                <Badge key={skill} color="indigo" className="text-xs">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-600">
                    Experience
                </h2>
                <div className="flex flex-col gap-6">
                    {experience.map((job) => (
                        <div key={job.role}>
                            <div className="flex justify-between flex-wrap gap-1">
                                <h3 className="font-semibold">{job.role}</h3>
                                <span className="text-sm text-gray-500">{job.dates}</span>
                            </div>
                            <p className="text-sm text-teal-500 mb-2">{job.company}</p>
                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-1">
                                {job.bullets.map((b) => (
                                    <li key={b}>{b}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-600">
                    Education
                </h2>
                <div className="flex flex-col gap-4">
                    {education.map((edu) => (
                        <div key={edu.school}>
                            <div className="flex justify-between flex-wrap gap-1">
                                <h3 className="font-semibold">{edu.school}</h3>
                                <span className="text-sm text-gray-500">{edu.dates}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {edu.degree}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
