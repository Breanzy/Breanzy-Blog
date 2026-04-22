"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import DashSidebar from "@/components/DashSidebar";
import DashProfile from "@/components/DashProfile";
import DashPosts from "@/components/DashPosts";
import DashUsers from "@/components/DashUsers";
import DashComments from "@/components/DashComments";
import DashboardComponent from "@/components/DashboardComponent";
import DashProjects from "@/components/DashProjects";
import DashSubscribers from "@/components/DashSubscribers";

function DashboardInner() {
    const searchParams = useSearchParams();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const tabFromUrl = searchParams.get("tab");
        if (tabFromUrl) setTab(tabFromUrl);
    }, [searchParams]);

    const tabMap: Record<string, React.ReactNode> = {
        profile: <DashProfile />,
        posts: <DashPosts />,
        projects: <DashProjects />,
        users: <DashUsers />,
        comments: <DashComments />,
        subscribers: <DashSubscribers />,
        dash: <DashboardComponent />,
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-56">
                <DashSidebar />
            </div>
            <AnimatePresence mode="wait">
                {tabMap[tab] && (
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1"
                    >
                        {tabMap[tab]}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <DashboardInner />
        </Suspense>
    );
}
