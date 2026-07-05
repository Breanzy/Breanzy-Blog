"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CallToAction() {
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
            className="relative rounded-xl overflow-hidden border p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            style={{
                background: "rgba(10,16,30,0.6)",
                backdropFilter: "blur(12px)",
                borderColor: "rgba(255,255,255,0.08)",
            }}
        >
            <div className="flex-1">
                <div
                    className="text-xs mb-2 uppercase tracking-[0.2em] font-mono"
                    style={{ color: "rgb(80 140 230)" }}
                >
                    {"// note"}
                </div>
                <h3 className="font-serif font-black text-white text-2xl uppercase tracking-tight leading-[0.95] mb-2">
                    like what you read?
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                    get new posts straight to your inbox. no spam, unsubscribe whenever.
                </p>
            </div>

            <div className="w-full sm:w-auto shrink-0">
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
                            className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
                        >
                            <input
                                type="email"
                                required
                                placeholder="you@somewhere.cool"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 sm:w-56 bg-black/40 border text-white placeholder:text-neutral-600 outline-none rounded-lg px-3 py-2.5 text-sm transition-colors border-white/10 focus:border-[rgb(80_140_230)]"
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
            </div>
        </div>
    );
}
