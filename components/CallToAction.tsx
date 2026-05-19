"use client";

import Link from "next/link";

export default function CallToAction() {
    return (
        <div
            className="relative rounded-xl overflow-hidden border p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            style={{
                background: "rgba(10,16,30,0.6)",
                backdropFilter: "blur(12px)",
                borderColor: "rgba(255,255,255,0.08)",
            }}
        >
            <div className="flex-1">
                <div
                    className="text-xs mb-2 uppercase tracking-[0.2em] font-mono"
                    style={{ color: "rgb(80 140 230)" }}
                >
                    {"// note"}
                </div>
                <h3 className="font-serif font-black text-white text-2xl uppercase tracking-tight leading-[0.95] mb-2">
                    like what you read?
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                    check out projects i&apos;m working on or reach out for collaboration.
                </p>
            </div>
            <Link href="/projects" className="btn-primary shrink-0">
                see projects →
            </Link>
        </div>
    );
}
