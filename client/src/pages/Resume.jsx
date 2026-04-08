// Skills grouped by type — update as needed
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
            "Built a full-stack personal website using the MERN stack with JWT auth and Firebase OAuth.",
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
        <div className="min-h-screen bg-black">
            <div className="max-w-3xl mx-auto px-4 py-16">
                {/* Header row */}
                <div className="flex items-start justify-between flex-wrap gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Resume</h1>
                        <p className="text-neutral-500 text-sm mt-1">
                            Brean Julius Carbonilla · Full-Stack Developer
                        </p>
                    </div>
                    {/* Replace href with your PDF URL when ready */}
                    <a
                        href="#"
                        className="border border-neutral-700 hover:border-blue-600 text-neutral-300 hover:text-white text-sm px-5 py-2 rounded-lg transition-colors"
                    >
                        Download PDF
                    </a>
                </div>

                {/* Skills */}
                <section className="mb-12">
                    <h2 className="text-white font-semibold text-lg mb-5 pb-2 border-b border-neutral-800">
                        Skills
                    </h2>
                    <div className="flex flex-col gap-3">
                        {Object.entries(skills).map(([group, items]) => (
                            <div key={group} className="flex flex-wrap items-center gap-2">
                                <span className="text-neutral-500 text-sm w-24 shrink-0">{group}</span>
                                {items.map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-0.5 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Experience */}
                <section className="mb-12">
                    <h2 className="text-white font-semibold text-lg mb-5 pb-2 border-b border-neutral-800">
                        Experience
                    </h2>
                    <div className="flex flex-col gap-8">
                        {experience.map((job) => (
                            <div key={job.role}>
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
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h2 className="text-white font-semibold text-lg mb-5 pb-2 border-b border-neutral-800">
                        Education
                    </h2>
                    <div className="flex flex-col gap-4">
                        {education.map((edu) => (
                            <div key={edu.school}>
                                <div className="flex justify-between flex-wrap gap-1">
                                    <h3 className="text-white font-medium">{edu.school}</h3>
                                    <span className="text-neutral-500 text-sm">{edu.dates}</span>
                                </div>
                                <p className="text-neutral-400 text-sm">{edu.degree}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
