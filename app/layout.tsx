import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Archivo } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import FetchInterceptor from "@/components/providers/FetchInterceptor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-space-grotesk",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["500", "600", "700", "800", "900"],
    variable: "--font-archivo",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Breanzy — Brean Julius Carbonilla",
        template: "%s | Breanzy",
    },
    description:
        "Brean Julius Carbonilla (Breanzy) — a Filipino full-stack software developer based in Melbourne. Down-to-earth takes on the tech industry, freelance projects, and notes on keeping up as a developer.",
    keywords: [
        "Breanzy",
        "who is Breanzy",
        "Brean Julius Carbonilla",
        "who is Brean Julius Carbonilla",
        "Breanzy software developer",
        "Breanzy coding",
        "Breanzy Melbourne",
        "Breanzy blogs",
        "full-stack developer Melbourne",
        "Filipino developer Melbourne",
        "software developer blog",
    ],
    authors: [{ name: "Brean Julius Carbonilla" }],
    creator: "Brean Julius Carbonilla",
    metadataBase: new URL(process.env.SITE_URL ?? "https://breanzy.com"),
    openGraph: {
        siteName: "Breanzy",
        type: "website",
        images: ["/og-image.png"],
    },
    twitter: {
        card: "summary_large_image",
    },
    verification: {
        google: "5fCeA4fzL8ZkNV6NJwNURRmmD1uTtWIop7roWpcvBFg",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${archivo.variable}`}>
            <body className={spaceGrotesk.className}>
                <ReduxProvider>
                    <FetchInterceptor />
                    <Header />
                    <PageTransition>
                        {children}
                    </PageTransition>
                    <Footer />
                </ReduxProvider>
            </body>
        </html>
    );
}
