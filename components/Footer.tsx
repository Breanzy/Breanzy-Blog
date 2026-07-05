import Link from "next/link";

const FOOTER_LINKS = [
    [
        "site",
        [
            ["Home", "/"],
            ["Blog", "/blog"],
            ["Projects", "/projects"],
            ["About", "/about"],
        ],
    ],
    [
        "elsewhere",
        [
            ["GitHub", "https://github.com/Breanzy"],
            ["LinkedIn", "https://www.linkedin.com/in/juliuscarbonilla/"],
            ["Twitter", "https://x.com/Breanzyy"],
        ],
    ],
] as [string, [string, string][]][];

export default function Footer() {
    return (
        <footer
            className="relative overflow-hidden"
            style={{ borderTop: "1px solid var(--hairline)", background: "var(--ink-1)" }}
        >
            <div className="max-w-7xl mx-auto px-6 py-14 relative">
                {/* Watermark wordmark */}
                <div
                    className="font-serif font-black leading-[0.85] select-none pointer-events-none tracking-[-0.04em] uppercase"
                    style={{ fontSize: "clamp(4rem,14vw,11rem)", color: "rgba(80,140,230,0.06)" }}
                >
                    breanzy
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-8 -mt-4 relative z-10">
                    <div className="grid grid-cols-2 gap-8 text-sm">
                        {FOOTER_LINKS.map(([group, items]) => (
                            <div key={group}>
                                <div className="text-neutral-500 uppercase tracking-[0.2em] text-[10px] mb-3">
                                    {group}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    {items.map(([label, href]) => (
                                        <Link
                                            key={label}
                                            href={href}
                                            className="text-neutral-300 hover:text-[rgb(80,140,230)] transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-neutral-500"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <div>© 2026 brean julius carbonilla</div>
                </div>
            </div>
        </footer>
    );
}
