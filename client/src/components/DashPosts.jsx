import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "./Modal";

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9) setShowMore(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) fetchPosts();
    }, [currentUser._id]);

    const handleShowMore = async () => {
        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${userPosts.length}`);
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) setShowMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) console.log(data.message);
            else setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
        } catch (error) {
            console.log(error.message);
        }
    };

    const thCls = "text-left text-neutral-500 font-medium px-4 py-3 text-xs uppercase tracking-wide";
    const tdCls = "px-4 py-3 text-neutral-300 text-sm";

    return (
        <div className="p-4 w-full">
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <div className="overflow-x-auto rounded-xl border border-neutral-800 scrollbar scrollbar-track-neutral-900 scrollbar-thumb-neutral-700">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900">
                                    <th className={thCls}>Updated</th>
                                    <th className={thCls}>Image</th>
                                    <th className={thCls}>Title</th>
                                    <th className={thCls}>Category</th>
                                    <th className={thCls}>Delete</th>
                                    <th className={thCls}>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userPosts.map((post) => (
                                    <tr key={post._id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors">
                                        <td className={tdCls}>{new Date(post.updatedAt).toLocaleDateString()}</td>
                                        <td className={tdCls}>
                                            <Link to={`/blog/${post.slug}`}>
                                                <img src={post.image} alt={post.title} className="w-20 h-11 object-cover rounded border border-neutral-700" />
                                            </Link>
                                        </td>
                                        <td className={`${tdCls} max-w-[220px]`}>
                                            <Link to={`/blog/${post.slug}`} className="text-white hover:text-blue-400 transition-colors line-clamp-2">
                                                {post.title}
                                            </Link>
                                        </td>
                                        <td className={tdCls}>{post.category}</td>
                                        <td className={tdCls}>
                                            <button
                                                onClick={() => { setShowModal(true); setPostIdToDelete(post._id); }}
                                                className="text-red-500 hover:text-red-400 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                        <td className={tdCls}>
                                            <Link to={`/update-post/${post._id}`} className="text-blue-500 hover:text-blue-400 transition-colors">
                                                Edit
                                            </Link>
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
                <p className="text-neutral-500 text-sm">No posts yet.</p>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
                    <p className="text-neutral-300 mb-6">Are you sure you want to delete this post?</p>
                    <div className="flex justify-center gap-3">
                        <button onClick={handleDeletePost} className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                            Yes, delete
                        </button>
                        <button onClick={() => setShowModal(false)} className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 text-sm px-4 py-2 rounded-lg transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
