"use client";

import { useEffect, useRef } from "react";

// Katakana block — feels authentically Matrix
const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

interface Stream {
    x: number;
    y: number;
    speed: number;
    chars: string[];
    headOpacity: number;
}

const FONT_SIZE = 15;
const MAX_STREAMS = 7; // sparse — not a flood
const STREAM_LENGTH_MIN = 5;
const STREAM_LENGTH_MAX = 14;
const COLOR = "#1a4f8a"; // dark blue

function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function makeStream(canvasWidth: number): Stream {
    const length = STREAM_LENGTH_MIN + Math.floor(Math.random() * (STREAM_LENGTH_MAX - STREAM_LENGTH_MIN));
    return {
        x: Math.random() * canvasWidth,
        y: -(length * FONT_SIZE) - Math.random() * 200, // start above viewport with stagger
        speed: 0.6 + Math.random() * 1.0,
        chars: Array.from({ length }, randomChar),
        headOpacity: 0.25 + Math.random() * 0.15, // 0.25–0.40 — never harsh
    };
}

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const parent = canvas.parentElement;
            canvas.width = parent ? parent.offsetWidth : window.innerWidth;
            canvas.height = parent ? parent.offsetHeight : window.innerHeight;
        };
        resize();
        const ro = new ResizeObserver(resize);
        if (canvas.parentElement) ro.observe(canvas.parentElement);

        // Stagger initial spawns so they don't all appear at once
        const streams: Stream[] = [];
        for (let i = 0; i < MAX_STREAMS; i++) {
            setTimeout(() => {
                streams.push(makeStream(canvas.width));
            }, i * 800 + Math.random() * 1200);
        }

        let animId: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${FONT_SIZE}px monospace`;

            for (let i = streams.length - 1; i >= 0; i--) {
                const s = streams[i];
                s.y += s.speed;

                // Randomly mutate a character to give flicker
                if (Math.random() < 0.04) {
                    s.chars[Math.floor(Math.random() * s.chars.length)] = randomChar();
                }

                for (let j = 0; j < s.chars.length; j++) {
                    const cy = s.y - j * FONT_SIZE;
                    if (cy < -FONT_SIZE || cy > canvas.height) continue;

                    // Head is brightest, trail fades linearly to 0
                    const alpha = j === 0
                        ? s.headOpacity
                        : s.headOpacity * Math.pow(1 - j / s.chars.length, 1.5);

                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = COLOR;
                    ctx.fillText(s.chars[j], s.x, cy);
                }

                ctx.globalAlpha = 1;

                // Stream finished — remove and schedule a new one with a random gap
                if (s.y - s.chars.length * FONT_SIZE > canvas.height) {
                    streams.splice(i, 1);
                    const delay = 1500 + Math.random() * 4000; // 1.5–5.5s gap before next
                    setTimeout(() => {
                        streams.push(makeStream(canvas.width));
                    }, delay);
                }
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
