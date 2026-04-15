"use client";

import { useEffect, useRef } from "react";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const FONT_SIZE = 16;
const MAX_STREAMS = 21;
const COLOR = "#1a4f8a";
const HEAD_ADVANCE_FRAMES = 4; // advance head 1 cell every N frames (~15 rows/sec at 60fps)
const FADE_PER_FRAME = 0.008;  // how fast trail cells lose opacity each frame

interface Cell {
    row: number;
    char: string;
    opacity: number;
}

interface Stream {
    col: number;       // fixed x column index
    headRow: number;   // current row the head is on
    cells: Cell[];     // trail cells that are fading out
    maxLength: number; // how many trail cells before head stops adding new ones
    tick: number;      // frame counter for head advancement
}

function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function makeStream(totalCols: number): Stream {
    return {
        col: Math.floor(Math.random() * totalCols),
        headRow: -Math.floor(Math.random() * 10), // stagger start above viewport
        cells: [],
        maxLength: 20 + Math.floor(Math.random() * 15),
        tick: 0,
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

        const totalCols = () => Math.floor(canvas.width / FONT_SIZE);
        const totalRows = () => Math.floor(canvas.height / FONT_SIZE);

        const streams: Stream[] = [];

        // Stagger initial spawns
        for (let i = 0; i < MAX_STREAMS; i++) {
            setTimeout(() => {
                streams.push(makeStream(totalCols()));
            }, i * 300 + Math.random() * 600);
        }

        let animId: number;
        let frame = 0;

        const draw = () => {
            frame++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${FONT_SIZE}px monospace`;

            for (let i = streams.length - 1; i >= 0; i--) {
                const s = streams[i];

                // Advance head position every N frames
                s.tick++;
                if (s.tick >= HEAD_ADVANCE_FRAMES) {
                    s.tick = 0;
                    s.headRow++;

                    // Plant a new cell at current head position (if on screen)
                    if (s.headRow >= 0 && s.headRow <= totalRows() && s.cells.length < s.maxLength) {
                        s.cells.push({ row: s.headRow, char: randomChar(), opacity: 0.40 + Math.random() * 0.15 });
                    }
                }

                const headOffscreen = s.headRow > totalRows();

                // Flicker — rapidly randomise chars (head flickers every frame, trail occasionally)
                for (let j = 0; j < s.cells.length; j++) {
                    // Once head is off-screen, treat everything as trail so it all fades out
                    const isHead = !headOffscreen && j === s.cells.length - 1;
                    if (isHead || Math.random() < 0.08) {
                        s.cells[j].char = randomChar();
                    }
                    if (!isHead) {
                        s.cells[j].opacity -= FADE_PER_FRAME;
                    }
                }

                // Remove fully faded cells
                s.cells = s.cells.filter(c => c.opacity > 0.01);

                // Draw each cell at its fixed row position
                for (const cell of s.cells) {
                    ctx.globalAlpha = cell.opacity;
                    ctx.fillStyle = COLOR;
                    ctx.fillText(cell.char, s.col * FONT_SIZE, cell.row * FONT_SIZE);
                }
                ctx.globalAlpha = 1;

                // Once head is off-screen and all trail has faded, restart from the top
                if (headOffscreen && s.cells.length === 0) {
                    s.headRow = -Math.floor(Math.random() * 10);
                    s.cells = [];
                    s.maxLength = 20 + Math.floor(Math.random() * 15);
                    s.col = Math.floor(Math.random() * totalCols());
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
