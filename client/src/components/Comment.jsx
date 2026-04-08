import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

/* Individual comment row with like, edit, and delete actions */
export default function Comment({ comment, onLike, onEdit, onDelete }) {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const { currentUser } = useSelector((state) => state.user);

    // Fetch the comment author's profile
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if (res.ok) setUser(data);
            } catch (error) {
                console.log(error.message);
            }
        };
        getUser();
    }, [comment]);

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editedContent }),
            });
            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const isLiked = currentUser && comment.likes.includes(currentUser._id);

    return (
        <div className="flex gap-3 p-4 border-b border-neutral-800 text-sm">
            {/* Avatar */}
            <img
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-neutral-800"
                src={user.profilePicture}
                alt={user.username}
            />

            <div className="flex-1">
                {/* Author + timestamp */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-xs">
                        {user ? `@${user.username}` : "anonymous"}
                    </span>
                    <span className="text-neutral-600 text-xs">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>

                {isEditing ? (
                    <>
                        <textarea
                            className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm resize-none mb-2"
                            rows={3}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="border border-neutral-700 hover:border-neutral-600 text-neutral-400 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-neutral-300 mb-2">{comment.content}</p>
                        <div className="flex items-center gap-3 text-xs">
                            {/* Like button */}
                            <button
                                type="button"
                                onClick={() => onLike(comment._id)}
                                className={`flex items-center gap-1 transition-colors ${
                                    isLiked ? "text-blue-500" : "text-neutral-500 hover:text-blue-500"
                                }`}
                            >
                                <FaThumbsUp />
                                {comment.numberOfLikes > 0 && (
                                    <span>{comment.numberOfLikes}</span>
                                )}
                            </button>

                            {/* Edit/delete — only for author or admin */}
                            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="text-neutral-500 hover:text-white transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(comment._id)}
                                        className="text-neutral-500 hover:text-red-500 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
