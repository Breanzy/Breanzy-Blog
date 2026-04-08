export default function About() {
    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-3xl mx-auto px-4 py-24">
                <h1 className="text-4xl font-bold text-white mb-10">About</h1>
                <div className="flex flex-col gap-6 text-neutral-400 text-base leading-relaxed">
                    <p>
                        I'm Brean Julius Carbonilla — a full-stack developer based in the
                        Philippines. I enjoy building web applications that are functional,
                        well-designed, and worth maintaining.
                    </p>
                    <p>
                        This site is where I document what I build and what I learn.
                        It started as a MERN stack learning project and evolved into a
                        personal space for sharing projects, writing, and my resume.
                    </p>
                    <p>
                        I'm interested in everything from backend architecture and APIs
                        to clean UI and developer experience. If something's worth building,
                        I want to understand how it works end to end.
                    </p>
                </div>

                {/* Divider */}
                <div className="mt-12 border-t border-neutral-800 pt-10">
                    <h2 className="text-white font-semibold text-lg mb-4">Built with</h2>
                    <div className="flex flex-wrap gap-2">
                        {["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Firebase", "Redux"].map((tech) => (
                            <span
                                key={tech}
                                className="text-sm bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-1 rounded-full"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
