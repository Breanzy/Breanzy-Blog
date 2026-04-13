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
        "Full-stack developer based in the Philippines. I build web apps and write about what I learn.",
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
