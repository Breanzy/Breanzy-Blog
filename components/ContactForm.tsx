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
        "w-full bg-black/40 border text-white placeholder:text-neutral-600 outline-none rounded-lg px-3 py-2.5 text-sm transition-colors"
        + " border-white/10 focus:border-[rgb(80_140_230)]";

    return (
        <FadeIn>
            <div className="max-w-2xl mx-auto">


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

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {status === "loading" ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        sending…
                                    </>
                                ) : (
                                    <>
                                        <span className="opacity-50">&gt;</span> send message{" "}
                                        <span className="arrow">→</span>
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </FadeIn>
    );
}
