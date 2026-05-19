"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import { POST_CATEGORIES } from "@/lib/postCategories";

const inputCls = "w-full bg-black/40 border border-white/10 text-white placeholder:text-neutral-600 outline-none focus:border-[rgb(80_140_230)] rounded-lg px-3 py-2 text-sm transition-colors";
const selectCls = "w-full bg-black/40 border border-white/10 text-white outline-none focus:border-[rgb(80_140_230)] rounded-lg px-3 py-2 text-sm transition-colors";

export default function SearchClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [sideBarData, setSideBarData] = useState({
        searchTerm: searchParams.get("searchTerm") || "",
        sort: searchParams.get("sort") || "desc",
        category: searchParams.get("category") || "",
    });
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const res = await fetch(`/api/post/getposts?${searchParams.toString()}`);
            if (!res.ok) { setLoading(false); return; }
            const data = await res.json();
            setPosts(data.posts);
            setLoading(false);
            setShowMore(data.posts.length === 9);
        };
        fetchPosts();
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSideBarData({ ...sideBarData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (sideBarData.searchTerm) params.set("searchTerm", sideBarData.searchTerm);
        params.set("sort", sideBarData.sort);
        params.set("category", sideBarData.category);
        router.push(`/search?${params.toString()}`);
    };

    const handleShowMore = async () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("startIndex", String(posts.length));
        const res = await fetch(`/api/post/getposts?${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        setShowMore(data.posts.length >= 9);
    };

    return (
        <div
            className="min-h-screen flex flex-col md:flex-row"
            style={{ background: "var(--ink-0)" }}
        >
            {/* Sidebar filters */}
            <aside
                className="md:w-72 shrink-0 p-6 border-b md:border-b-0 md:border-r"
                style={{
                    borderColor: "rgba(255,255,255,0.06)",
                    background: "rgba(6,10,22,0.6)",
                    backdropFilter: "blur(12px)",
                }}
            >
                <div
                    className="text-xs mb-4 uppercase tracking-[0.2em] font-mono"
                    style={{ color: "rgb(80 140 230)" }}
                >
                    {"// filters"}
                </div>
                <h2 className="font-serif font-black text-white text-xl uppercase tracking-tight leading-[0.95] mb-6">
                    refine <span style={{ color: "rgb(80 140 230)" }}>results</span>
                </h2>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="searchTerm" className="text-neutral-400 text-xs uppercase tracking-[0.15em] font-mono">
                            search
                        </label>
                        <input
                            id="searchTerm"
                            type="text"
                            placeholder="search posts..."
                            value={sideBarData.searchTerm}
                            onChange={handleChange}
                            className={inputCls}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="sort" className="text-neutral-400 text-xs uppercase tracking-[0.15em] font-mono">
                            sort
                        </label>
                        <select id="sort" value={sideBarData.sort} onChange={handleChange} className={selectCls}>
                            <option value="desc" className="bg-neutral-900">latest</option>
                            <option value="asc"  className="bg-neutral-900">oldest</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="category" className="text-neutral-400 text-xs uppercase tracking-[0.15em] font-mono">
                            category
                        </label>
                        <select id="category" value={sideBarData.category} onChange={handleChange} className={selectCls}>
                            <option value="" className="bg-neutral-900">all</option>
                            {POST_CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value} className="bg-neutral-900">
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn-primary">
                        apply filters
                    </button>
                </form>
            </aside>

            {/* Results */}
            <div className="flex-1 p-6 md:p-8">
                <div
                    className="flex items-baseline justify-between mb-6 pb-4"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <div>
                        <div
                            className="text-xs mb-2 uppercase tracking-[0.2em] font-mono"
                            style={{ color: "rgb(80 140 230)" }}
                        >
                            {"// found " + posts.length}
                        </div>
                        <h1 className="font-serif font-black text-white text-3xl uppercase tracking-tight">
                            search <span className="text-neutral-500">results</span>
                        </h1>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">
                        sorted: {sideBarData.sort === "desc" ? "latest" : "oldest"}
                    </span>
                </div>

                <div className="flex flex-wrap gap-4 justify-start">
                    {loading && (
                        <p className="text-neutral-500 w-full text-center py-12 font-mono">
                            <span
                                className="inline-block w-2 h-3.5 mr-2 animate-pulse"
                                style={{ background: "rgb(80 140 230)" }}
                            />
                            loading…
                        </p>
                    )}
                    {!loading && posts.length === 0 && (
                        <p className="text-neutral-500 w-full text-center py-12 font-mono">
                            no posts found.
                        </p>
                    )}
                    {!loading && posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>

                {showMore && (
                    <button
                        onClick={handleShowMore}
                        className="mt-8 w-full transition-colors py-4 rounded-lg text-sm font-mono"
                        style={{
                            color: "rgb(80 140 230)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgb(80 140 230)")}
                    >
                        show more →
                    </button>
                )}
            </div>
        </div>
    );
}
