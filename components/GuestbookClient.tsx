"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import type { RootState } from "@/redux/store";
import { formatPostDate } from "@/utils/readingTime";

export default function GuestbookClient() {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [entries, setEntries] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadEntries = async () => {
            try {
                const res = await fetch("/api/guestbook");
                if (res.ok) setEntries(await res.json());
            } catch (error: any) {
                setError(error.message);
            }
        };
        loadEntries();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || content.length > 240) return;

        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/api/guestbook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Could not sign the guestbook.");
                return;
            }
            setEntries((prev) => [data, ...prev]);
            setContent("");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-10">
            {currentUser ? (
                <form onSubmit={handleSubmit} className="border border-neutral-800 bg-neutral-950/60 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3 text-xs text-neutral-500">
                        <Image src={currentUser.profilePicture} alt="" width={22} height={22} className="rounded-full object-cover" />
                        <span>Signing as @{currentUser.username}</span>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={240}
                        rows={3}
                        placeholder="Leave a note..."
                        className="w-full bg-transparent text-white placeholder:text-neutral-600 focus:outline-none text-sm resize-none"
                    />
                    <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-neutral-800">
                        <span className="text-neutral-600 text-xs">{240 - content.length} characters remaining</span>
                        <motion.button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            whileHover={!isSubmitting ? { scale: 1.04 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.96 } : {}}
                            transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs px-4 py-1.5 rounded-lg transition-colors"
                        >
                            {isSubmitting ? "Signing..." : "Sign guestbook"}
                        </motion.button>
                    </div>
                    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                </form>
            ) : (
                <div className="border border-neutral-800 bg-neutral-950/60 rounded-xl p-5">
                    <p className="text-neutral-400 text-sm">
                        <Link href="/sign-in" className="text-blue-500 hover:text-blue-400 transition-colors">Sign in</Link>
                        {" "}to leave a note in the guestbook.
                    </p>
                </div>
            )}

            <div className="mt-8 flex flex-col gap-3">
                <AnimatePresence initial={false}>
                    {entries.map((entry) => (
                        <motion.article
                            key={entry._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ type: "spring" as const, stiffness: 220, damping: 22 }}
                            className="border border-neutral-800 bg-black rounded-xl p-4"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                {entry.profilePicture && (
                                    <Image src={entry.profilePicture} alt="" width={32} height={32} className="rounded-full object-cover" />
                                )}
                                <div>
                                    <p className="text-white text-sm font-medium">@{entry.username}</p>
                                    <p className="text-neutral-600 text-xs">{formatPostDate(entry.createdAt)}</p>
                                </div>
                            </div>
                            <p className="text-neutral-300 text-sm leading-relaxed">{entry.content}</p>
                        </motion.article>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
