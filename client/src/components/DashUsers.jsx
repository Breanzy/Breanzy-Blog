import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";
import Modal from "./Modal";

export default function DashUsers() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) setShowMore(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) fetchUsers();
    }, [currentUser._id]);

    const handleShowMore = async () => {
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${users.length}`);
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) setShowMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) console.log(data.message);
            else setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        } catch (error) {
            console.log(error.message);
        }
    };

    const thCls = "text-left text-neutral-500 font-medium px-4 py-3 text-xs uppercase tracking-wide";
    const tdCls = "px-4 py-3 text-neutral-300 text-sm";

    return (
        <div className="p-4 w-full">
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <div className="overflow-x-auto rounded-xl border border-neutral-800 scrollbar scrollbar-track-neutral-900 scrollbar-thumb-neutral-700">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900">
                                    <th className={thCls}>Created</th>
                                    <th className={thCls}>Avatar</th>
                                    <th className={thCls}>Username</th>
                                    <th className={thCls}>Email</th>
                                    <th className={thCls}>Admin</th>
                                    <th className={thCls}>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors">
                                        <td className={tdCls}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className={tdCls}>
                                            <img src={user.profilePicture} alt={user.username} className="w-9 h-9 rounded-full object-cover border border-neutral-700" />
                                        </td>
                                        <td className={tdCls}>{user.username}</td>
                                        <td className={tdCls}>{user.email}</td>
                                        <td className={tdCls}>
                                            {user.isAdmin
                                                ? <FaCheck className="text-green-500" />
                                                : <FaTimes className="text-neutral-600" />
                                            }
                                        </td>
                                        <td className={tdCls}>
                                            <button
                                                onClick={() => { setShowModal(true); setUserIdToDelete(user._id); }}
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
                <p className="text-neutral-500 text-sm">No users yet.</p>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
                    <p className="text-neutral-300 mb-6">Are you sure you want to delete this user?</p>
                    <div className="flex justify-center gap-3">
                        <motion.button onClick={handleDeleteUser} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                            Yes, delete
                        </motion.button>
                        <motion.button onClick={() => setShowModal(false)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 text-sm px-4 py-2 rounded-lg transition-colors">
                            Cancel
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
