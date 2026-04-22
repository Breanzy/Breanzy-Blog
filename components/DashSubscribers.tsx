"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineExclamationCircle, HiMail } from "react-icons/hi";
import { useSelector } from "react-redux";
import Modal from "./Modal";

export default function DashSubscribers() {
    const { currentUser } = useSelector((state: any) => state.user);
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [subscriberIdToDelete, setSubscriberIdToDelete] = useState("");
    const [testEmail, setTestEmail] = useState("");
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [testMessage, setTestMessage] = useState("");
    const [testStatus, setTestStatus] = useState<"success" | "error" | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscribers = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/subscriber/getsubscribers");
                const data = await res.json();
                if (res.ok) {
                    setSubscribers(data.subscribers);
                    if (data.subscribers.length < 9) setShowMore(false);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser.isAdmin) fetchSubscribers();
    }, [currentUser._id, currentUser.isAdmin]);

    const handleShowMore = async () => {
        try {
            const res = await fetch(`/api/subscriber/getsubscribers?startIndex=${subscribers.length}`);
            const data = await res.json();
            if (res.ok) {
                setSubscribers((prev) => [...prev, ...data.subscribers]);
                if (data.subscribers.length < 9) setShowMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteSubscriber = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/subscriber/delete/${subscriberIdToDelete}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) console.log(data.message);
            else setSubscribers((prev) => prev.filter((subscriber) => subscriber._id !== subscriberIdToDelete));
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const handleSendTest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSendingTest(true);
        setTestMessage("");
        setTestStatus(null);

        try {
            const res = await fetch("/api/subscriber/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: testEmail }),
            });
            const data = await res.json();

            if (!res.ok) {
                setTestStatus("error");
                setTestMessage(data.message || "Failed to send test newsletter.");
                return;
            }

            setTestStatus("success");
            setTestMessage(data.message);
        } catch (error: any) {
            setTestStatus("error");
            setTestMessage(error.message || "Failed to send test newsletter.");
        } finally {
            setIsSendingTest(false);
        }
    };

    const thCls = "text-left text-neutral-500 font-medium px-4 py-3 text-xs uppercase tracking-wide";
    const tdCls = "px-4 py-3 text-neutral-300 text-sm";

    return (
        <div className="p-4 w-full">
            {currentUser.isAdmin && (
                <div className="mb-6 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="rounded-full bg-blue-950/60 p-2 border border-blue-900/70">
                            <HiMail className="text-blue-400 text-lg" />
                        </div>
                        <div>
                            <h2 className="text-white text-lg font-semibold">Test Newsletter</h2>
                            <p className="text-neutral-400 text-sm">
                                Send a sample newsletter to a chosen email address before publishing a real post.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSendTest} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            className="flex-1 min-w-0 bg-black/40 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600/60 rounded-lg px-3 py-2 text-sm backdrop-blur-sm"
                        />
                        <motion.button
                            type="submit"
                            disabled={isSendingTest}
                            whileHover={!isSendingTest ? { scale: 1.04 } : {}}
                            whileTap={!isSendingTest ? { scale: 0.97 } : {}}
                            transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                            className="shrink-0 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                            {isSendingTest ? "Sending..." : "Send test"}
                        </motion.button>
                    </form>

                    {testMessage && (
                        <p className={`mt-3 text-sm ${testStatus === "success" ? "text-green-400" : "text-red-400"}`}>
                            {testMessage}
                        </p>
                    )}
                </div>
            )}

            {currentUser.isAdmin && subscribers.length > 0 ? (
                <>
                    <div className="overflow-x-auto rounded-xl border border-neutral-800 scrollbar scrollbar-track-neutral-900 scrollbar-thumb-neutral-700">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900">
                                    <th className={thCls}>Subscribed</th>
                                    <th className={thCls}>Email</th>
                                    <th className={thCls}>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.map((subscriber) => (
                                    <tr key={subscriber._id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors">
                                        <td className={tdCls}>{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                                        <td className={tdCls}>{subscriber.email}</td>
                                        <td className={tdCls}>
                                            <button
                                                onClick={() => { setShowModal(true); setSubscriberIdToDelete(subscriber._id); }}
                                                className="text-red-500 hover:text-red-400 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {showMore && (
                        <button onClick={handleShowMore} className="mt-4 w-full text-blue-500 hover:text-blue-400 text-sm py-3 transition-colors">
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p className="text-neutral-500 text-sm">
                    {loading ? "Loading subscribers..." : "No subscribers yet."}
                </p>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
                    <p className="text-neutral-300 mb-6">Are you sure you want to remove this subscriber?</p>
                    <div className="flex justify-center gap-3">
                        <motion.button onClick={handleDeleteSubscriber} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                            Yes, remove
                        </motion.button>
                        <motion.button onClick={() => setShowModal(false)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 text-sm px-4 py-2 rounded-lg transition-colors">
                            Cancel
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
