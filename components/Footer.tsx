import Link from "next/link";
import { BsFacebook, BsInstagram, BsTwitterX, BsGithub, BsLinkedin } from "react-icons/bs";

export default function Footer() {
    return (
        <footer className="bg-black/50 backdrop-blur-xl border-t border-white/[0.06]">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    {/* Logo + tagline */}
                    <div>
                        <Link href="/" className="text-white font-bold text-lg">
                            Brean<span className="text-blue-500">zy</span>
                        </Link>
                        <p className="text-neutral-500 text-sm mt-2 max-w-xs">
                            Full-stack developer. Building things for the web.
                        </p>
                    </div>

                    {/* Nav links */}
                    <div className="flex gap-12 flex-wrap text-sm">
                        <div className="flex flex-col gap-2">
                            <span className="text-neutral-400 font-medium mb-1">Site</span>
                            <Link href="/about" className="text-neutral-500 hover:text-white transition-colors">About</Link>
                            <Link href="/blog" className="text-neutral-500 hover:text-white transition-colors">Blog</Link>
                            <Link href="/projects" className="text-neutral-500 hover:text-white transition-colors">Projects</Link>
                            <Link href="/resume" className="text-neutral-500 hover:text-white transition-colors">Resume</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-neutral-400 font-medium mb-1">Legal</span>
                            <a href="#" className="text-neutral-500 hover:text-white transition-colors">Terms</a>
                            <a href="#" className="text-neutral-500 hover:text-white transition-colors">Privacy</a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-neutral-600 text-xs">
                        &copy; {new Date().getFullYear()} Brean Julius Carbonilla. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="https://github.com/Breanzy" target="_blank" rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-blue-500 transition-colors">
                            <BsGithub className="text-lg" />
                        </a>
                        <a href="https://www.linkedin.com/in/juliuscarbonilla/" target="_blank" rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-blue-500 transition-colors">
                            <BsLinkedin className="text-lg" />
                        </a>
                        <a href="https://x.com/Breanzyy" target="_blank" rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-blue-500 transition-colors">
                            <BsTwitterX className="text-lg" />
                        </a>
                        <a href="https://www.facebook.com/Breanzyy" target="_blank" rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-blue-500 transition-colors">
                            <BsFacebook className="text-lg" />
                        </a>
                        <a href="https://www.instagram.com/breanzy/" target="_blank" rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-blue-500 transition-colors">
                            <BsInstagram className="text-lg" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
