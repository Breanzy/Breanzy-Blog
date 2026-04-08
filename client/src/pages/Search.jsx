import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const inputCls = "w-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm";
const selectCls = "w-full bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm";

export default function Search() {
    const [sideBarData, setSideBarData] = useState({
        searchTerm: "",
        sort: "desc",
        category: "uncategorized",
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const sortFromUrl = urlParams.get("sort");
        const categoryFromUrl = urlParams.get("category");
        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSideBarData({
                ...sideBarData,
                searchTerm: searchTermFromUrl || "",
                sort: sortFromUrl || "desc",
                category: categoryFromUrl || "uncategorized",
            });
        }
        const fetchPosts = async () => {
            setLoading(true);
            const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
            if (!res.ok) { setLoading(false); return; }
            const data = await res.json();
            setPosts(data.posts);
            setLoading(false);
            setShowMore(data.posts.length === 9);
        };
        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        setSideBarData({ ...sideBarData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", sideBarData.searchTerm);
        urlParams.set("sort", sideBarData.sort);
        urlParams.set("category", sideBarData.category);
        navigate(`/search?${urlParams.toString()}`);
    };

    const handleShowMore = async () => {
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", posts.length);
        const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        setShowMore(data.posts.length >= 9);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row">
            {/* Sidebar filters */}
            <aside className="md:w-64 shrink-0 p-6 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="searchTerm" className="text-neutral-400 text-sm">Search</label>
                        <input
                            id="searchTerm"
                            type="text"
                            placeholder="Search posts..."
                            value={sideBarData.searchTerm}
                            onChange={handleChange}
                            className={inputCls}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="sort" className="text-neutral-400 text-sm">Sort</label>
                        <select id="sort" value={sideBarData.sort} onChange={handleChange} className={selectCls}>
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="category" className="text-neutral-400 text-sm">Category</label>
                        <select id="category" value={sideBarData.category} onChange={handleChange} className={selectCls}>
                            <option value="uncategorized">All</option>
                            <option value="reactjs">React.js</option>
                            <option value="nextjs">Next.js</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    >
                        Apply Filters
                    </button>
                </form>
            </aside>

            {/* Results */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-semibold text-white mb-6 pb-4 border-b border-neutral-800">
                    Results
                </h1>
                <div className="flex flex-wrap gap-4 justify-center">
                    {loading && (
                        <p className="text-neutral-500 w-full text-center py-12">Loading...</p>
                    )}
                    {!loading && posts.length === 0 && (
                        <p className="text-neutral-500 w-full text-center py-12">No posts found.</p>
                    )}
                    {!loading && posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
                {showMore && (
                    <button
                        onClick={handleShowMore}
                        className="mt-8 w-full text-blue-500 hover:text-blue-400 text-sm transition-colors py-4"
                    >
                        Show More
                    </button>
                )}
            </div>
        </div>
    );
}
