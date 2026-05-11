"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./FadeIn";

const SUBJECTS = ["Job Opportunity", "Project Collaboration", "General"];

export default function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
    const [status, setStatus] = useState<"loading" | "success" | "error" | null>(null);
    const [feedback, setFeedback] = useState("");

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            setStatus(data.success ? "success" : "error");
            setFeedback(data.message);
        } catch {
            setStatus("error");
            setFeedback("Something went wrong. Please try again.");
        }
    };

    const inputClass =
        "w-full bg-black/40 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600/60 rounded-lg px-3 py-2.5 text-sm backdrop-blur-sm transition-colors";

    return (
        <FadeIn>
            <div className="glass-card p-8 rounded-xl max-w-2xl mx-auto">
                <h2 className="text-white text-2xl font-semibold mb-1">Reach Out to Me</h2>
                <p className="text-neutral-400 text-sm mb-6">
                    Whether it's a job opportunity, a project idea, or just a hello — I'd love to hear from you.
                </p>

                <AnimatePresence mode="wait">
                    {status === "success" ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-3 py-10 text-center"
                        >
                            <span className="text-3xl">✉️</span>
                            <p className="text-green-400 font-medium">{feedback}</p>
                            <button
                                onClick={() => { setStatus(null); setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" }); }}
                                className="text-neutral-500 hover:text-white text-xs transition-colors mt-2"
                            >
                                Send another message
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex gap-4 flex-col sm:flex-row">
                                <input
                                    required
                                    type="text"
                                    placeholder="Your name"
                                    value={form.name}
                                    onChange={set("name")}
                                    className={inputClass}
                                />
                                <input
                                    required
                                    type="email"
                                    placeholder="your@email.com"
                                    value={form.email}
                                    onChange={set("email")}
                                    className={inputClass}
                                />
                            </div>

                            <select
                                value={form.subject}
                                onChange={set("subject")}
                                className={inputClass + " cursor-pointer"}
                            >
                                {SUBJECTS.map((s) => (
                                    <option key={s} value={s} className="bg-neutral-900">{s}</option>
                                ))}
                            </select>

                            <textarea
                                required
                                rows={5}
                                placeholder="Your message..."
                                value={form.message}
                                onChange={set("message")}
                                className={inputClass + " resize-none"}
                            />

                            {status === "error" && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-xs"
                                >
                                    {feedback}
                                </motion.p>
                            )}

                            <motion.button
                                type="submit"
                                disabled={status === "loading"}
                                whileHover={status !== "loading" ? { scale: 1.03, boxShadow: "0 0 20px rgba(37,99,235,0.4)" } : {}}
                                whileTap={status !== "loading" ? { scale: 0.97 } : {}}
                                transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                                className="self-start bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                            >
                                {status === "loading" ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending…
                                    </>
                                ) : "Send Message"}
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </FadeIn>
    );
}
