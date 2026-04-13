"use client";

import { motion } from "framer-motion";
import FadeIn from "./FadeIn";

export default function CallToAction() {
    return (
        <FadeIn>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-neutral-800 rounded-xl bg-neutral-900 max-w-4xl mx-auto">
                <div className="flex-1 flex flex-col gap-3 text-center sm:text-left">
                    <h2 className="text-white text-xl font-semibold">Want to see more projects?</h2>
                    <p className="text-neutral-400 text-sm">
                        Check out my open-source work and experiments on GitHub.
                    </p>
                    <motion.a
                        href="https://github.com/Breanzy"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors self-start sm:self-start"
                    >
                        View GitHub
                    </motion.a>
                </div>
                <div className="flex-1 flex justify-center">
                    <img
                        src="https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/2EP14mWkbx9sq03nWnRSGT/f1d22d88bb5dde030275f9520c0f2e92/React_YT_Thumbnail.png"
                        alt="React"
                        className="max-h-40 rounded-lg object-contain opacity-80"
                    />
                </div>
            </div>
        </FadeIn>
    );
}
