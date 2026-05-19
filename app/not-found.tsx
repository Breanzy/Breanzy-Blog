import Link from "next/link";
import MatrixRain from "@/components/MatrixRain";
import Aurora from "@/components/Aurora";
import HeroHUD from "@/components/HeroHUD";
import HexTicker from "@/components/HexTicker";
import GlassCard from "@/components/GlassCard";

export default function NotFound() {
    return (
        <main
            className="relative min-h-[760px] flex items-center justify-center px-6 py-16 overflow-hidden"
            style={{ background: "var(--ink-0)" }}
        >
            <MatrixRain density={0.6} intensity={0.55} />
            <Aurora />
            <HeroHUD compact />
            <HexTicker y="20%" />
            <HexTicker y="80%" />

            <div className="relative z-10 text-center max-w-2xl">
                <div
                    className="font-mono text-[11px] tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-2"
                    style={{ color: "rgba(248,113,113,0.8)" }}
                >
                    <span className="text-neutral-600">$</span>
                    <span>error.code</span>
                    <span className="text-neutral-600">= 404</span>
                    <span
                        className="inline-block w-2 h-3.5 ml-1 animate-pulse"
                        style={{ background: "rgb(248,113,113)" }}
                    />
                </div>

                <h1
                    className="font-serif font-black text-white tracking-[-0.04em] leading-[0.85]"
                    style={{ fontSize: "clamp(6rem,18vw,14rem)" }}
                >
                    <span
                        className="glitch-text"
                        data-text="404"
                        style={{ color: "rgb(80 140 230)", textShadow: "0 0 28px rgba(80,140,230,0.4)" }}
                    >
                        404
                    </span>
                </h1>

                <h2
                    className="font-serif font-black text-white text-3xl uppercase tracking-[-0.03em] mt-6 mb-3"
                >
                    <span className="text-neutral-500 font-semibold">{"// "}</span>
                    page not{" "}
                    <span style={{ color: "rgb(80 140 230)" }}>found</span>
                    <span className="animate-pulse" style={{ color: "rgb(80 140 230)" }}>
                        _
                    </span>
                </h2>

                <p className="text-neutral-400 text-base leading-relaxed max-w-md mx-auto mb-8 font-mono">
                    <span style={{ color: "rgb(80 140 230 / 0.7)" }}>&gt;</span> the page you&apos;re looking for
                    doesn&apos;t exist or may have been moved.
                </p>

                <div className="max-w-md mx-auto mb-8 text-left">
                    <GlassCard className="p-4 font-mono text-[11px] leading-relaxed">
                        <div className="text-neutral-500">
                            $ curl -I https://breanzy.com/missing-page
                        </div>
                        <div className="text-red-400 mt-1">HTTP/2 404 Not Found</div>
                        <div className="text-neutral-600">x-served-by: edge-mnl-01</div>
                        <div className="text-neutral-600">x-cache: MISS</div>
                        <div className="text-neutral-600">last-seen: never</div>
                    </GlassCard>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link href="/" className="btn-primary">
                        ← back to home
                    </Link>
                    <Link
                        href="/blog"
                        className="px-6 py-3 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors backdrop-blur-md"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                        browse all posts
                    </Link>
                </div>
            </div>
        </main>
    );
}
