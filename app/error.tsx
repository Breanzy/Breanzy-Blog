"use client";

import { useEffect } from "react";
import MatrixRain from "@/components/MatrixRain";
import Aurora from "@/components/Aurora";
import HeroHUD from "@/components/HeroHUD";
import GlassCard from "@/components/GlassCard";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main
            className="relative min-h-[760px] flex items-center justify-center px-6 py-16 overflow-hidden"
            style={{ background: "var(--ink-0)" }}
        >
            <MatrixRain density={0.4} intensity={0.5} />
            <Aurora />
            <HeroHUD compact />

            <div className="relative z-10 text-center max-w-2xl">
                <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-red-400 mb-4 flex items-center justify-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>system.exception</span>
                    <span className="text-neutral-600">--unhandled</span>
                </div>

                <h1
                    className="font-serif font-black text-white uppercase tracking-[-0.03em] leading-[0.92]"
                    style={{ fontSize: "clamp(2.5rem,7vw,5.5rem)" }}
                >
                    <span className="text-neutral-500 font-semibold">{"// "}</span>
                    something{" "}
                    <span
                        className="glitch-text"
                        data-text="broke"
                        style={{ color: "rgb(248 113 113)", textShadow: "0 0 30px rgba(248,113,113,0.35)" }}
                    >
                        broke
                    </span>
                    <span className="text-red-400 animate-pulse">_</span>
                </h1>

                <p className="text-neutral-400 text-base leading-relaxed max-w-md mx-auto mt-6 mb-8 font-mono">
                    <span className="text-red-400/70">&gt;</span> an unexpected error occurred. try refreshing the
                    page, and if it persists — i probably know about it.
                </p>

                {/* Fake stack trace */}
                <div className="max-w-lg mx-auto mb-8 text-left">
                    <GlassCard className="p-4 font-mono text-[10px] leading-relaxed">
                        <div className="text-red-400 mb-2">Error: UnexpectedException at runtime</div>
                        <div className="text-neutral-500">
                            at <span className="text-neutral-300">HomeClient</span>{" "}
                            (app/HomeClient.tsx:42:7)
                        </div>
                        <div className="text-neutral-500">
                            at <span className="text-neutral-300">PageTransition</span>{" "}
                            (components/PageTransition.tsx:12:5)
                        </div>
                        <div className="text-neutral-500">
                            at <span className="text-neutral-300">RootLayout</span>{" "}
                            (app/layout.tsx:24:3)
                        </div>
                        {error.digest && (
                            <div className="text-neutral-600 mt-2">digest: {error.digest}</div>
                        )}
                    </GlassCard>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button onClick={reset} className="btn-primary">
                        ↺ try again
                    </button>
                    <a
                        href="/"
                        className="px-6 py-3 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors backdrop-blur-md"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                        go home
                    </a>
                </div>
            </div>
        </main>
    );
}
