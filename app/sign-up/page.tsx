"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MatrixRain from "@/components/MatrixRain";
import Aurora from "@/components/Aurora";
import HeroHUD from "@/components/HeroHUD";
import GlassCard from "@/components/GlassCard";
import OAuth from "@/components/OAuth";

const inputClass =
    "bg-black/40 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-[rgb(80_140_230)] rounded-lg px-3 py-2.5 text-sm transition-colors";

export default function SignUpPage() {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setErrorMessage(null);
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) { setLoading(false); return setErrorMessage(data.message); }
            if (res.ok) router.push("/sign-in");
        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden"
            style={{ background: "var(--ink-0)" }}
        >
            <MatrixRain density={0.5} intensity={0.5} />
            <Aurora />
            <HeroHUD compact />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="flex items-center justify-between mb-8 reveal-fast">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span
                            className="relative w-8 h-8 grid place-items-center rounded-md"
                            style={{ background: "var(--ink-3)", border: "1px solid rgba(80,140,230,0.3)" }}
                        >
                            <span className="text-[rgb(80_140_230)] text-sm font-black font-serif">B</span>
                        </span>
                        <span className="font-serif font-black text-lg text-white tracking-tight uppercase">
                            Breanzy
                        </span>
                    </Link>
                    <Link
                        href="/"
                        className="text-xs text-neutral-500 transition-colors font-mono"
                        onMouseEnter={(e) => (e.currentTarget.style.color = "rgb(80 140 230)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                    >
                        ← back to home
                    </Link>
                </div>

                <GlassCard className="p-8 reveal">
                    <div
                        className="font-mono text-[11px] tracking-[0.2em] uppercase mb-4 flex items-center gap-2"
                        style={{ color: "rgb(80 140 230 / 0.8)" }}
                    >
                        <span className="text-neutral-600">$</span>
                        <span>auth.register</span>
                        <span
                            className="inline-block w-2 h-3.5 ml-1 animate-pulse"
                            style={{ background: "rgb(80 140 230)" }}
                        />
                    </div>

                    <h1 className="font-serif font-black text-white text-3xl uppercase tracking-[-0.03em] leading-[0.95] mb-2">
                        JOIN{" "}
                        <span style={{ color: "rgb(80 140 230)" }}>THE FEED.</span>
                    </h1>
                    <p className="text-neutral-400 text-sm mb-7">
                        create an account to follow new posts and join the discussion.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {[
                            { id: "username", type: "text", label: "username", placeholder: "brean_dev" },
                            { id: "email",    type: "email", label: "email",    placeholder: "you@example.com" },
                            { id: "password", type: "password", label: "password", placeholder: "••••••••" },
                        ].map((field) => (
                            <div key={field.id} className="flex flex-col gap-1.5">
                                <label
                                    htmlFor={field.id}
                                    className="text-neutral-400 text-xs uppercase tracking-[0.15em] font-mono"
                                >
                                    {field.label}
                                </label>
                                <input
                                    id={field.id}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary mt-2 w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    creating account…
                                </>
                            ) : (
                                <>
                                    <span className="opacity-50">&gt;</span> create account{" "}
                                    <span className="arrow">→</span>
                                </>
                            )}
                        </button>

                        <div className="relative flex items-center gap-3 my-2">
                            <span className="flex-1 h-px bg-white/10" />
                            <span className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-mono">or</span>
                            <span className="flex-1 h-px bg-white/10" />
                        </div>

                        <OAuth />
                    </form>

                    {errorMessage && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-red-400 text-sm text-center font-mono"
                        >
                            {errorMessage}
                        </motion.p>
                    )}
                </GlassCard>

                <p className="mt-6 text-center text-neutral-500 text-sm">
                    already have an account?{" "}
                    <Link href="/sign-in" style={{ color: "rgb(80 140 230)" }} className="hover:underline">
                        sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
