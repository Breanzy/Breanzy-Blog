import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import FetchInterceptor from "@/components/providers/FetchInterceptor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
    title: {
        default: "Breanzy — Brean Julius Carbonilla",
        template: "%s | Breanzy",
    },
    description:
        "Brean Julius Carbonilla — full-stack developer in the Philippines. Projects, and notes on life as a software developer.",
    keywords: ["Brean Carbonilla", "Brean Julius Carbonilla", "Breanzy", "full-stack developer Philippines", "software developer blog"],
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
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
