"use client";

import { useEffect, useRef } from "react";

interface MatrixRainProps {
    density?: number;
    intensity?: number;
}

/** High-DPI canvas matrix rain — variable speed per stream, two depth layers, glowing heads. */
export default function MatrixRain({ density = 0.7, intensity = 0.7 }: MatrixRainProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const CHARS =
            "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ<>/{}[]()=!?*&%$#";
        const FONT = 13;

        const resize = () => {
            const p = canvas.parentElement;
            if (!p) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = p.offsetWidth * dpr;
            canvas.height = p.offsetHeight * dpr;
            canvas.style.width = p.offsetWidth + "px";
            canvas.style.height = p.offsetHeight + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        if (canvas.parentElement) ro.observe(canvas.parentElement);

        const cw = () => canvas.parentElement?.offsetWidth ?? 0;
        const ch = () => canvas.parentElement?.offsetHeight ?? 0;
        const cols = () => Math.floor(cw() / FONT);
        const rows = () => Math.floor(ch() / FONT);

        type Cell   = { row: number; char: string; op: number; flicker: boolean };
        type Stream = {
            col: number; head: number; cells: Cell[]; max: number;
            tick: number; speed: number; fadeRate: number; layer: "near" | "far";
        };

        let streams: Stream[] = [];

        const makeStream = (col: number): Stream => ({
            col,
            head: -Math.floor(Math.random() * 30),
            cells: [],
            max: 14 + Math.floor(Math.random() * 26),
            tick: 0,
            speed: 2 + Math.floor(Math.random() * 5),
            fadeRate: 0.005 + Math.random() * 0.012,
            layer: Math.random() < 0.3 ? "far" : "near",
        });

        const initStreams = () => {
            streams = [];
            const target = Math.floor(cols() * 0.55 * density);
            const used = new Set<number>();
            for (let i = 0; i < target; i++) {
                let col = 0;
                let tries = 0;
                do { col = Math.floor(Math.random() * cols()); tries++; } while (used.has(col) && tries < 10);
                used.add(col);
                streams.push(makeStream(col));
            }
        };
        initStreams();

        const onResize = () => initStreams();
        window.addEventListener("resize", onResize);

        let raf: number;
        const draw = () => {
            ctx.fillStyle = "rgba(3, 5, 12, 0.12)";
            ctx.fillRect(0, 0, cw(), ch());
            ctx.font = `${FONT}px "JetBrains Mono", monospace`;

            streams.forEach((s) => {
                s.tick++;
                if (s.tick >= s.speed) {
                    s.tick = 0;
                    s.head++;
                    if (s.head >= 0 && s.head <= rows() + 4 && s.cells.length < s.max) {
                        s.cells.push({
                            row: s.head,
                            char: CHARS[Math.floor(Math.random() * CHARS.length)],
                            op: 0.5 + Math.random() * 0.25,
                            flicker: Math.random() < 0.04,
                        });
                    }
                }

                for (let j = 0; j < s.cells.length; j++) {
                    const isHead = j === s.cells.length - 1 && s.head <= rows() + 4;
                    if (isHead || Math.random() < 0.05 || s.cells[j].flicker) {
                        s.cells[j].char = CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                    if (!isHead) s.cells[j].op -= s.fadeRate;
                }
                s.cells = s.cells.filter((c) => c.op > 0.015);

                s.cells.forEach((c, idx) => {
                    const isHead = idx === s.cells.length - 1 && s.head <= rows() + 4;
                    const layerMul = s.layer === "far" ? 0.45 : 1;
                    if (isHead) {
                        ctx.fillStyle = `rgba(220, 235, 255, ${0.95 * intensity * layerMul})`;
                        ctx.shadowColor = "rgba(80,140,230,0.7)";
                        ctx.shadowBlur = s.layer === "near" ? 8 : 2;
                    } else {
                        ctx.fillStyle = `rgba(80,140,230, ${c.op * intensity * layerMul})`;
                        ctx.shadowBlur = 0;
                    }
                    ctx.fillText(c.char, s.col * FONT, c.row * FONT);
                });
                ctx.shadowBlur = 0;

                if (s.head > rows() + s.max && s.cells.length === 0) {
                    Object.assign(s, makeStream(Math.floor(Math.random() * cols())));
                }
            });

            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, [density, intensity]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0, opacity: 0.85 }}
        />
    );
}
