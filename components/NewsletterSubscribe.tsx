"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterSubscribe() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"loading" | "success" | "error" | null>(null);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const res = await fetch("/api/subscriber/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            setStatus(data.success ? "success" : "error");
            setMessage(data.message);
            if (data.success) setEmail("");
        } catch {
            setStatus("error");
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div
            className="relative rounded-xl overflow-hidden border p-6 md:p-8"
            style={{ background: "rgba(8,12,24,0.7)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.08)" }}
        >
            <div className="flex-1">
                    <h3 className="font-serif font-black text-white text-2xl uppercase tracking-tight leading-[0.95] mb-1">
                        subscribe to the{" "}
                        <span style={{ color: "rgb(80 140 230)" }}>newsletter</span>
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                        one email every other week. new posts, things i&apos;m building, occasional reflections.
                        no spam. unsubscribe whenever.
                    </p>

                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.p
                                key="success"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-emerald-400 text-sm font-mono"
                            >
                                {message}
                            </motion.p>
                        ) : (
                            <motion.form
                                key="form"
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col sm:flex-row gap-2 max-w-md"
                            >
                                <input
                                    type="email"
                                    required
                                    placeholder="you@somewhere.cool"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-black/40 border text-white placeholder:text-neutral-600 outline-none rounded-lg px-3 py-2.5 text-sm transition-colors border-white/10 focus:border-[rgb(80_140_230)]"
                                />
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="btn-primary shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{ padding: "10px 18px" }}
                                >
                                    {status === "loading" ? (
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        "subscribe"
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {status === "error" && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs mt-2 font-mono"
                        >
                            {message}
                        </motion.p>
                    )}

                    <div className="mt-3 text-xs text-neutral-500 flex items-center gap-3 font-mono">
                        <span className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 0 spam ever
                        </span>
                    </div>
            </div>
        </div>
    );
}
