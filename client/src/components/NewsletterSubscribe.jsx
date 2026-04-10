import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./FadeIn";

export default function NewsletterSubscribe() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null); // "loading" | "success" | "error"
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
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
        <FadeIn>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-neutral-800 rounded-xl bg-neutral-900 max-w-4xl mx-auto">
                {/* Text */}
                <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
                    <h2 className="text-white text-xl font-semibold">Stay in the loop</h2>
                    <p className="text-neutral-400 text-sm">
                        Get notified whenever I publish a new article. No spam — just new posts.
                    </p>
                </div>

                {/* Form */}
                <div className="flex-1 w-full">
                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.p
                                key="success"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-green-400 text-sm text-center sm:text-left"
                            >
                                {message}
                            </motion.p>
                        ) : (
                            <motion.form
                                key="form"
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-2"
                            >
                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 min-w-0 bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm"
                                />
                                <motion.button
                                    type="submit"
                                    disabled={status === "loading"}
                                    whileHover={status !== "loading" ? { scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" } : {}}
                                    whileTap={status !== "loading" ? { scale: 0.96 } : {}}
                                    animate={{ opacity: status === "loading" ? 0.7 : 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="shrink-0 bg-blue-600 hover:bg-blue-500 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    {status === "loading" ? (
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : "Subscribe"}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {status === "error" && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-xs mt-2"
                        >
                            {message}
                        </motion.p>
                    )}
                </div>
            </div>
        </FadeIn>
    );
}
