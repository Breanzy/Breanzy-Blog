"use client";

import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Modal from "./Modal";

export default function DashComments() {
    const { currentUser } = useSelector((state: any) => state.user);
    const [comments, setComments] = useState<any[]>([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    if (data.comments.length < 9) setShowMore(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) fetchComments();
    }, [currentUser._id]);

    const handleShowMore = async () => {
        try {
            const res = await fetch(`/api/comment/getcomments?startIndex=${comments.length}`);
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
                if (data.comments.length < 9) setShowMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) console.log(data.message);
            else setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete));
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const thCls = "text-left text-neutral-500 font-medium px-4 py-3 text-xs uppercase tracking-wide";
    const tdCls = "px-4 py-3 text-neutral-300 text-sm";

    return (
        <div className="p-4 w-full">
            {currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <div className="overflow-x-auto rounded-xl border border-neutral-800 scrollbar scrollbar-track-neutral-900 scrollbar-thumb-neutral-700">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900">
                                    <th className={thCls}>Updated</th>
                                    <th className={thCls}>Content</th>
                                    <th className={thCls}>Likes</th>
                                    <th className={thCls}>Post ID</th>
                                    <th className={thCls}>User ID</th>
                                    <th className={thCls}>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comments.map((comment) => (
                                    <tr key={comment._id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors">
                                        <td className={tdCls}>{new Date(comment.updatedAt).toLocaleDateString()}</td>
                                        <td className={`${tdCls} max-w-[220px]`}>
                                            <p className="line-clamp-2">{comment.content}</p>
                                        </td>
                                        <td className={tdCls}>{comment.numberOfLikes}</td>
                                        <td className={`${tdCls} max-w-[120px] truncate`}>{comment.postId}</td>
                                        <td className={`${tdCls} max-w-[120px] truncate`}>{comment.userId}</td>
                                        <td className={tdCls}>
                                            <button
                                                onClick={() => { setShowModal(true); setCommentIdToDelete(comment._id); }}
                                                className="text-red-500 hover:text-red-400 transition-colors"
                                            >
                                                Delete
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
                <p className="text-neutral-500 text-sm">No comments yet.</p>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
                    <p className="text-neutral-300 mb-6">Are you sure you want to delete this comment?</p>
                    <div className="flex justify-center gap-3">
                        <motion.button onClick={handleDeleteComment} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                            Yes, delete
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
