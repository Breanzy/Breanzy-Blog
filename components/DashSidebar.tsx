"use client";

import {
    HiUser,
    HiArrowSmRight,
    HiDocumentText,
    HiOutlineUserGroup,
    HiAnnotation,
    HiChartPie,
    HiCollection,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { signoutSuccess } from "@/redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

/* Sidebar navigation for the admin dashboard */
export default function DashSidebar() {
    const { currentUser } = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const tabFromUrl = searchParams.get("tab");
        if (tabFromUrl) setTab(tabFromUrl);
    }, [searchParams]);

    const handleSignout = async () => {
        try {
            const res = await fetch("/api/user/signout", { method: "POST" });
            const data = await res.json();
            if (res.ok) dispatch(signoutSuccess());
            else console.log(data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const navItem = (href: string, label: string, Icon: any, activeKey: string) => {
        const isActive = tab === activeKey;
        return (
            <Link href={href} key={activeKey}>
                <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 20 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                        isActive
                            ? "bg-neutral-800 text-white"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                    }`}
                >
                    <Icon className="text-base shrink-0" />
                    <span>{label}</span>
                </motion.div>
            </Link>
        );
    };

    return (
        <nav className="w-full md:w-56 bg-neutral-950 border-b md:border-b-0 md:border-r border-neutral-800 p-3 min-h-full">
            <div className="flex flex-col gap-1">
                {currentUser?.isAdmin && navItem("/dashboard?tab=dash", "Dashboard", HiChartPie, "dash")}

                <Link href="/dashboard?tab=profile">
                    <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring" as const, stiffness: 400, damping: 20 }}
                        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                            tab === "profile"
                                ? "bg-neutral-800 text-white"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <HiUser className="text-base shrink-0" />
                            <span>Profile</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            currentUser?.isAdmin
                                ? "border-blue-800 text-blue-400 bg-blue-950/40"
                                : "border-neutral-700 text-neutral-500"
                        }`}>
                            {currentUser?.isAdmin ? "Admin" : "User"}
                        </span>
                    </motion.div>
                </Link>

                {currentUser?.isAdmin && (
                    <>
                        {navItem("/dashboard?tab=posts", "Posts", HiDocumentText, "posts")}
                        {navItem("/dashboard?tab=projects", "Projects", HiCollection, "projects")}
                        {navItem("/dashboard?tab=users", "Users", HiOutlineUserGroup, "users")}
                        {navItem("/dashboard?tab=comments", "Comments", HiAnnotation, "comments")}
                    </>
                )}

                <div className="my-2 border-t border-neutral-800" />

                <motion.button
                    onClick={handleSignout}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 20 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors w-full text-left"
                >
                    <HiArrowSmRight className="text-base shrink-0" />
                    Sign Out
                </motion.button>
            </div>
        </nav>
    );
}
