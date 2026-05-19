import Aurora from "@/components/Aurora";
import HeroHUD from "@/components/HeroHUD";
import ScanSweep from "@/components/ScanSweep";

interface MiniHeroProps {
    eyebrow: string;
    title: string;
    subtitle?: string;
    accentWord?: string;
}

/** Compact hero banner for inner pages (blog, projects, search). */
export default function MiniHero({ eyebrow, title, subtitle, accentWord }: MiniHeroProps) {
    return (
        <section className="relative overflow-hidden">
            <Aurora />
            <HeroHUD compact />
            <ScanSweep />
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-[0.15]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgb(80 140 230 / 0.15) 1px, transparent 1px), linear-gradient(90deg, rgb(80 140 230 / 0.15) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                    maskImage: "radial-gradient(ellipse at center, black 25%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 70%)",
                }}
            />
            <div className="relative z-20 max-w-6xl mx-auto px-6 pt-20 pb-16">
                <div
                    className="font-mono text-[11px] tracking-[0.2em] uppercase mb-4 flex items-center gap-2"
                    style={{ color: "rgb(80 140 230 / 0.8)" }}
                >
                    <span className="text-neutral-600">$</span>
                    <span>{eyebrow}</span>
                    <span
                        className="inline-block w-2 h-3.5 ml-1 animate-pulse"
                        style={{ background: "rgb(80 140 230)" }}
                    />
                </div>
                <h1
                    className="font-serif font-black text-white leading-[0.92] tracking-[-0.03em] uppercase"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
                >
                    <span className="text-neutral-500 font-semibold">{"// "}</span>
                    {accentWord ? (
                        <>
                            {title.split(accentWord)[0]}
                            <span
                                className="glitch-text"
                                data-text={accentWord}
                                style={{
                                    color: "rgb(80 140 230)",
                                    textShadow: "0 0 28px rgba(80,140,230,0.4)",
                                }}
                            >
                                {accentWord}
                            </span>
                            {title.split(accentWord)[1]}
                        </>
                    ) : (
                        title
                    )}
                    <span className="animate-pulse" style={{ color: "rgb(80 140 230)" }}>
                        _
                    </span>
                </h1>
                {subtitle && (
                    <p className="mt-5 text-neutral-400 text-base leading-relaxed max-w-2xl font-mono">
                        <span style={{ color: "rgb(80 140 230 / 0.7)" }}>&gt;</span> {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
