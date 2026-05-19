"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "@/redux/user/userSlice";

const NAV_ITEMS = [
    { key: "dash",        label: "overview",     glyph: "◈" },
    { key: "profile",     label: "profile",      glyph: "◯" },
    { key: "posts",       label: "posts",        glyph: "✎" },
    { key: "projects",    label: "projects",     glyph: "⌬" },
    { key: "comments",    label: "comments",     glyph: "◉" },
    { key: "users",       label: "users",        glyph: "☰" },
    { key: "subscribers", label: "subscribers",  glyph: "✉" },
];

/** Sidebar navigation for the admin dashboard. */
export default function DashSidebar() {
    const { currentUser } = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const t = searchParams.get("tab");
        if (t) setTab(t);
    }, [searchParams]);

    const handleSignout = async () => {
        try {
            const res = await fetch("/api/user/signout", { method: "POST" });
            if (res.ok) dispatch(signoutSuccess());
        } catch (error) {
            console.log(error);
        }
    };

    const visibleItems = NAV_ITEMS.filter((it) => {
        if (it.key === "dash") return currentUser?.isAdmin;
        if (["posts", "projects", "users", "comments", "subscribers"].includes(it.key))
            return currentUser?.isAdmin;
        return true;
    });

    return (
        <aside
            className="md:w-60 shrink-0 border-b md:border-b-0 md:border-r p-5 min-h-full"
            style={{
                borderColor: "rgba(255,255,255,0.06)",
                background: "rgba(6,10,22,0.7)",
                backdropFilter: "blur(16px)",
            }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
                <span
                    className="w-8 h-8 grid place-items-center rounded-md"
                    style={{ background: "var(--ink-3)", border: "1px solid rgba(80,140,230,0.3)" }}
                >
                    <span className="text-[rgb(80_140_230)] text-sm font-black font-serif">B</span>
                </span>
                <div>
                    <div className="font-serif font-black text-sm text-white tracking-tight uppercase">
                        Breanzy
                    </div>
                    <div
                        className="text-[10px] font-mono uppercase tracking-[0.15em]"
                        style={{ color: "rgb(80 140 230)" }}
                    >
                        {currentUser?.isAdmin ? "admin" : "user"}
                    </div>
                </div>
            </div>

            <div className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-mono mb-2 px-2">
                {"// navigation"}
            </div>

            <nav className="flex flex-col gap-1">
                {visibleItems.map((it) => {
                    const isActive = tab === it.key || (!tab && it.key === "profile");
                    return (
                        <Link
                            key={it.key}
                            href={`/dashboard?tab=${it.key}`}
                            className="relative flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-300"
                            style={{
                                color: isActive ? "#fff" : "rgb(180 180 180)",
                                background: isActive ? "rgb(80 140 230 / 0.12)" : "transparent",
                                border: isActive
                                    ? "1px solid rgb(80 140 230 / 0.3)"
                                    : "1px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) (e.currentTarget as HTMLElement).style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) (e.currentTarget as HTMLElement).style.color = "rgb(180 180 180)";
                            }}
                        >
                            <span style={{ color: isActive ? "rgb(80 140 230)" : "rgb(100 100 120)" }}>
                                {it.glyph}
                            </span>
                            <span>{it.label}</span>
                            {isActive && (
                                <span className="ml-auto text-xs" style={{ color: "rgb(80 140 230)" }}>
                                    _
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Account section */}
            <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-mono mb-3 px-2">
                    {"// account"}
                </div>
                <div className="flex items-center gap-3 p-2 mb-2">
                    <div
                        className="w-8 h-8 rounded-md grid place-items-center text-sm font-bold"
                        style={{
                            background: "var(--ink-3)",
                            border: "1px solid rgba(80,140,230,0.25)",
                            color: "rgb(80 140 230)",
                        }}
                    >
                        {currentUser?.username?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs text-white truncate">{currentUser?.username ?? "—"}</div>
                        <div className="text-[10px] text-neutral-500 truncate">{currentUser?.email ?? ""}</div>
                    </div>
                </div>
                <button
                    onClick={handleSignout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-500 transition-colors"
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgb(248 113 113)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "")}
                >
                    ↗ sign out
                </button>
            </div>
        </aside>
    );
}
