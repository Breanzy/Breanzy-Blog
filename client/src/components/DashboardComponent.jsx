import { useEffect, useState } from "react";
import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiDocumentText,
    HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashboardComponent() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/user/getUsers");
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/post/getPosts?limit=5");
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        const fetchComments = async () => {
            try {
                const res = await fetch("/api/comment/getcomments?limit=5");
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser]);

    /* Reusable stat card */
    const StatCard = ({ label, total, lastMonth, Icon, iconBg }) => (
        <div className="flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl p-4 gap-4 md:w-64 w-full">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-neutral-500 text-xs uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-white text-2xl font-semibold">{total}</p>
                </div>
                <div className={`${iconBg} p-3 rounded-full`}>
                    <Icon className="text-white text-xl" />
                </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
                <HiArrowNarrowUp className="text-green-400" />
                <span className="text-green-400">{lastMonth}</span>
                <span className="text-neutral-500 ml-1">last month</span>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-6xl mx-auto w-full">
            {/* Stat cards */}
            <div className="flex flex-wrap gap-4 mb-8">
                <StatCard label="Total Users" total={totalUsers} lastMonth={lastMonthUsers} Icon={HiOutlineUserGroup} iconBg="bg-blue-600" />
                <StatCard label="Total Comments" total={totalComments} lastMonth={lastMonthComments} Icon={HiAnnotation} iconBg="bg-indigo-600" />
                <StatCard label="Total Posts" total={totalPosts} lastMonth={lastMonthPosts} Icon={HiDocumentText} iconBg="bg-green-700" />
            </div>

            {/* Recent data tables */}
            <div className="flex flex-wrap gap-4">
                {/* Recent Users */}
                <div className="flex-1 min-w-[260px] bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-800">
                        <h2 className="text-white text-sm font-medium">Recent Users</h2>
                        <Link to="/dashboard?tab=users" className="text-blue-500 hover:text-blue-400 text-xs transition-colors">
                            See all
                        </Link>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-800">
                                <th className="text-left text-neutral-500 font-medium px-4 py-2">Avatar</th>
                                <th className="text-left text-neutral-500 font-medium px-4 py-2">Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-4 py-2">
                                        <img src={user.profilePicture} alt={user.username} className="w-8 h-8 rounded-full object-cover border border-neutral-700" />
                                    </td>
                                    <td className="px-4 py-2 text-neutral-300">{user.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Recent Comments */}
                <div className="flex-1 min-w-[260px] bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-800">
                        <h2 className="text-white text-sm font-medium">Recent Comments</h2>
                        <Link to="/dashboard?tab=comments" className="text-blue-500 hover:text-blue-400 text-xs transition-colors">
                            See all
                        </Link>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-800">
                                <th className="text-left text-neutral-500 font-medium px-4 py-2">Content</th>
                                <th className="text-left text-neutral-500 font-medium px-4 py-2">Likes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((comment) => (
                                <tr key={comment._id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-4 py-2 text-neutral-300 max-w-[200px]">
                                        <p className="line-clamp-2">{comment.content}</p>
                                    </td>
                                    <td className="px-4 py-2 text-neutral-300">{comment.numberOfLikes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Recent Posts */}
                <div className="flex-1 min-w-[260px] bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-800">
                        <h2 className="text-white text-sm font-medium">Recent Posts</h2>
                        <Link to="/dashboard?tab=posts" className="text-blue-500 hover:text-blue-400 text-xs transition-colors">
                            See all
                        </Link>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-800">
                                <th className="text-left text-neutral-500 font-medium px-4 py-2">Image</th>
                                <th className="text-left text-neutral-500 font-medium px-4 py-2">Title</th>
                                <th className="text-left text-neutral-500 font-medium px-4 py-2">Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post._id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors">
                                    <td className="px-4 py-2">
                                        <img src={post.image} alt={post.title} className="w-12 h-8 rounded object-cover border border-neutral-700" />
                                    </td>
                                    <td className="px-4 py-2 text-neutral-300 max-w-[180px]">
                                        <p className="line-clamp-1">{post.title}</p>
                                    </td>
                                    <td className="px-4 py-2 text-neutral-500">{post.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
