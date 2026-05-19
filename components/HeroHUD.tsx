"use client";

import { useState, useEffect } from "react";

interface HeroHUDProps {
    compact?: boolean;
}

/** Corner L-bracket HUD with live time + coordinate readouts. */
export default function HeroHUD({ compact = false }: HeroHUDProps) {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, []);

    const time = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const ts = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

    const stroke = "rgb(80 140 230 / 0.5)";
    const brackets: Record<string, string> = {
        tl: "M2,14 L2,2 L14,2",
        tr: "M14,14 L14,2 L2,2",
        bl: "M2,2 L2,14 L14,14",
        br: "M14,2 L14,14 L2,14",
    };
    const Bracket = ({ which }: { which: keyof typeof brackets }) => (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d={brackets[which]} stroke={stroke} strokeWidth="1" fill="none" />
        </svg>
    );

    return (
        <div aria-hidden className="absolute inset-0 pointer-events-none z-[18]">
            <div className="absolute top-6 left-6"><Bracket which="tl" /></div>
            <div className="absolute top-6 right-6"><Bracket which="tr" /></div>
            <div className="absolute bottom-6 left-6"><Bracket which="bl" /></div>
            <div className="absolute bottom-6 right-6"><Bracket which="br" /></div>

            {!compact && (
                <>
                    <div className="absolute top-6 left-12 font-mono text-[10px] tracking-[0.2em] uppercase leading-relaxed"
                        style={{ color: "rgb(80 140 230 / 0.7)" }}>
                        <div>sys.status <span className="text-emerald-400/80">● ONLINE</span></div>
                        <div>node.uptime 00:{pad(time.getMinutes())}:{pad(time.getSeconds())}</div>
                        <div>mem.caffeine <span className="text-white/70">98%</span></div>
                    </div>
                    <div className="absolute top-6 right-12 font-mono text-[10px] tracking-[0.2em] uppercase leading-relaxed text-right"
                        style={{ color: "rgb(80 140 230 / 0.7)" }}>
                        <div>loc <span className="text-white/70">14.5995°N 120.9842°E</span></div>
                        <div>ts <span className="text-white/70">{ts}</span></div>
                        <div>ver <span className="text-white/70">v2.3.7-beta</span></div>
                    </div>
                    <div className="absolute bottom-8 right-12 font-mono text-[10px] tracking-[0.2em] uppercase flex items-center gap-2"
                        style={{ color: "rgb(80 140 230 / 0.6)" }}>
                        signal
                        <span className="inline-flex gap-0.5 items-end">
                            {[4, 7, 10, 6, 9].map((h, i) => (
                                <span
                                    key={i}
                                    className="w-[3px] bg-[rgb(80_140_230)]"
                                    style={{
                                        height: h,
                                        animation: `pulse-soft 1.4s ease-in-out ${i * 120}ms infinite`,
                                        opacity: 0.6 + i * 0.08,
                                    }}
                                />
                            ))}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
