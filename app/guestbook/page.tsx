import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import GuestbookClient from "@/components/GuestbookClient";

export const metadata: Metadata = {
    title: "Guestbook",
    description: "Leave a short note on Breanzy's personal website.",
};

export default function GuestbookPage() {
    return (
        <main className="min-h-screen bg-black">
            <div className="max-w-2xl mx-auto px-4 py-20">
                <FadeIn>
                    <p className="text-blue-500 text-sm font-medium mb-3">Guestbook</p>
                    <h1 className="text-4xl font-bold text-white mb-4">Leave a little trace</h1>
                    <p className="text-neutral-400 leading-relaxed">
                        A small wall for notes, hellos, and tiny proof that someone passed through.
                    </p>
                </FadeIn>
                <GuestbookClient />
            </div>
        </main>
    );
}
