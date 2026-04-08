import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Comment from "./Comment";
import Modal from "./Modal";

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const navigate = useNavigate();

    // Fetch comments for this post
    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        getComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) return;
        try {
            const res = await fetch("/api/comment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id }),
            });
            const data = await res.json();
            if (res.ok) {
                setComment("");
                setCommentError(null);
                setComments([data, ...comments]);
            }
        } catch (error) {
            setCommentError(error.message);
        }
    };

    // Toggle like on a comment
    const handleLike = async (commentId) => {
        if (!currentUser) { navigate("/sign-in"); return; }
        try {
            const res = await fetch(`/api/comment/likeComment/${commentId}`, { method: "PUT" });
            if (res.ok) {
                const data = await res.json();
                setComments(comments.map((c) =>
                    c._id === commentId ? { ...c, likes: data.likes, numberOfLikes: data.likes.length } : c
                ));
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    // Update comment content locally after edit
    const handleEdit = (comment, editedContent) => {
        setComments(comments.map((c) => c._id === comment._id ? { ...c, content: editedContent } : c));
    };

    const handleDelete = async (commentId) => {
        if (!currentUser) { navigate("/sign-in"); return; }
        setShowModal(false);
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentId}`, { method: "DELETE" });
            if (res.ok) {
                setComments(comments.filter((c) => c._id !== commentId));
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full mt-10">
            {/* Signed-in state */}
            {currentUser ? (
                <div className="flex items-center gap-2 mb-4 text-xs text-neutral-500">
                    <span>Signed in as</span>
                    <img src={currentUser.profilePicture} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <Link to="/dashboard?tab=profile" className="text-blue-500 hover:text-blue-400 transition-colors">
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <p className="text-sm text-neutral-500 mb-4">
                    <Link to="/sign-in" className="text-blue-500 hover:text-blue-400 transition-colors">Sign in</Link>
                    {" "}to leave a comment.
                </p>
            )}

            {/* Comment form */}
            {currentUser && (
                <form onSubmit={handleSubmit} className="border border-neutral-800 rounded-xl p-4 mb-6">
                    <textarea
                        placeholder="Add a comment..."
                        rows={3}
                        maxLength={200}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-transparent text-white placeholder:text-neutral-600 focus:outline-none text-sm resize-none"
                    />
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-800">
                        <span className="text-neutral-600 text-xs">{200 - comment.length} characters remaining</span>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-1.5 rounded-lg transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                    {commentError && (
                        <p className="text-red-400 text-xs mt-2">{commentError}</p>
                    )}
                </form>
            )}

            {/* Comments list */}
            {comments.length > 0 && (
                <>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-white text-sm font-medium">Comments</span>
                        <span className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                            {comments.length}
                        </span>
                    </div>
                    <div className="border border-neutral-800 rounded-xl overflow-hidden">
                        {comments.map((c) => (
                            <Comment
                                key={c._id}
                                comment={c}
                                onLike={handleLike}
                                onEdit={handleEdit}
                                onDelete={(id) => { setShowModal(true); setCommentToDelete(id); }}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Delete confirmation modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
                    <p className="text-neutral-300 mb-6">Are you sure you want to delete this comment?</p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => handleDelete(commentToDelete)}
                            className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                            Yes, delete
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
