import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ["var(--font-archivo)", "ui-sans-serif", "system-ui", "sans-serif"],
                mono:  ['"JetBrains Mono"', "var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
                sans:  ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
            },
            colors: {
                ink: {
                    0: "#03050c",
                    1: "#060b18",
                    2: "#0a1428",
                    3: "#0f1d38",
                },
            },
        },
    },
    plugins: [require("tailwind-scrollbar")],
};

export default config;
