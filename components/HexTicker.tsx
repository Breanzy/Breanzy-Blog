"use client";

import { useMemo } from "react";

interface HexTickerProps {
    y?: string;
}

/** Three rows of scrolling hex bytes for hero atmospheric depth. */
export default function HexTicker({ y = "50%" }: HexTickerProps) {
    const rows = useMemo(() => {
        const gen = (n: number) =>
            Array.from({ length: n }, () =>
                Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase()
            ).join(" ");
        return [gen(60), gen(60), gen(60)];
    }, []);

    return (
        <div
            aria-hidden
            className="absolute left-0 right-0 pointer-events-none overflow-hidden z-[17]"
            style={{
                top: y,
                transform: "translateY(-50%)",
                maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
            }}
        >
            {rows.map((r, i) => (
                <div
                    key={i}
                    className="whitespace-nowrap flex font-mono text-[10px] tracking-[0.2em]"
                    style={{
                        color: `rgb(80 140 230 / ${0.06 + i * 0.03})`,
                        animation: `hex-scroll ${40 + i * 15}s linear infinite`,
                        animationDirection: i % 2 ? "reverse" : "normal",
                        marginTop: i === 0 ? 0 : 26,
                    }}
                >
                    <span className="pr-8">{r}</span>
                    <span className="pr-8">{r}</span>
                    <span className="pr-8">{r}</span>
                </div>
            ))}
        </div>
    );
}
