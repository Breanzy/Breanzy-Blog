"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "@/redux/user/userSlice";
import { useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import type { RootState } from "@/redux/store";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleSignout = async () => {
        try {
            const res = await fetch("/api/user/signout", { method: "POST" });
            if (res.ok) dispatch(signoutSuccess());
        } catch (error) {
            console.log(error);
        }
    };

    const links = [
        { href: "/",         label: "home",     active: pathname === "/" },
        { href: "/blog",     label: "blog",     active: pathname === "/blog" || pathname.startsWith("/blog/") },
        { href: "/projects", label: "projects", active: pathname === "/projects" || pathname.startsWith("/projects/") },
    ];

    return (
        <header
            className="sticky top-0 z-50"
            style={{
                backgroundColor: "rgba(3,5,12,0.78)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid var(--hairline)",
            }}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 reveal-slide shrink-0">
                    <div
                        className="relative w-8 h-8 rounded-md overflow-hidden"
                        style={{ border: "1px solid rgba(80,140,230,0.3)" }}
                    >
                        <Image src="/logo.png" alt="Breanzy" fill className="object-cover" sizes="32px" priority />
                    </div>
                    <span className="font-serif font-black text-lg text-white tracking-tight uppercase">
                        Breanzy
                    </span>
                </Link>

                {/* Search — hidden on mobile */}
                <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-xs reveal-fade">
                    <div
                        className="relative flex items-center gap-2 rounded-md px-3 py-1.5 w-full"
                        style={{ background: "var(--ink-1)", border: "1px solid var(--hairline)" }}
                    >
                        <span className="text-neutral-500 text-xs font-mono">/</span>
                        <input
                            className="flex-1 bg-transparent outline-none text-sm text-neutral-300 placeholder:text-neutral-600"
                            placeholder="search for a post..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </form>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1 text-sm reveal-fade">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="nav-link relative px-3.5 py-1.5 transition-colors"
                            style={{ color: l.active ? "#fff" : "rgb(160 160 170)" }}
                        >
                            {l.active && (
                                <span
                                    className="absolute inset-0 rounded-md"
                                    style={{
                                        background: "rgba(80,140,230,0.08)",
                                        border: "1px solid rgba(80,140,230,0.22)",
                                    }}
                                />
                            )}
                            <span className="relative">{l.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-3 shrink-0 reveal-slide">
                    {currentUser ? (
                        <Menu as="div" className="relative">
                            <MenuButton className="focus:outline-none">
                                <div className="relative w-8 h-8 rounded-md overflow-hidden border transition-colors"
                                    style={{ borderColor: "rgba(80,140,230,0.3)" }}>
                                    <Image
                                        src={currentUser.profilePicture}
                                        alt="avatar"
                                        fill
                                        className="object-cover"
                                        sizes="32px"
                                    />
                                </div>
                            </MenuButton>
                            <MenuItems
                                className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl focus:outline-none overflow-hidden"
                                style={{
                                    background: "rgba(6,11,24,0.95)",
                                    border: "1px solid var(--hairline)",
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                <div className="px-4 py-3 border-b border-white/[0.06]">
                                    <p className="text-white text-sm font-medium truncate">{currentUser.username}</p>
                                    <p className="text-neutral-500 text-xs truncate">{currentUser.email}</p>
                                </div>
                                <MenuItem>
                                    <Link
                                        href="/dashboard?tab=profile"
                                        className="block px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/[0.06] hover:text-white transition-colors font-mono"
                                    >
                                        profile
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <button
                                        onClick={handleSignout}
                                        className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/[0.06] hover:text-white transition-colors border-t border-white/[0.06] font-mono"
                                    >
                                        sign out
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    ) : (
                        <Link href="/sign-in" className="btn-primary" style={{ padding: "8px 18px" }}>
                            <span className="opacity-50">&gt;</span> sign in
                        </Link>
                    )}

                    {/* Mobile hamburger */}
                    <motion.button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        animate={{ rotate: mobileOpen ? 90 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="md:hidden text-neutral-400 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <HiX className="text-xl" /> : <HiMenuAlt3 className="text-xl" />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile nav */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden"
                        style={{ borderTop: "1px solid var(--hairline)", background: "rgba(3,5,12,0.9)" }}
                    >
                        <div className="px-4 pb-4">
                            <form onSubmit={handleSearch} className="mt-3 mb-2">
                                <div
                                    className="flex items-center gap-2 rounded-md px-3 py-2"
                                    style={{ background: "var(--ink-1)", border: "1px solid var(--hairline)" }}
                                >
                                    <span className="text-neutral-500 text-xs font-mono">/</span>
                                    <input
                                        className="flex-1 bg-transparent outline-none text-sm text-neutral-300 placeholder:text-neutral-600"
                                        placeholder="search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </form>
                            <nav className="flex flex-col gap-1">
                                {links.map((l, i) => (
                                    <motion.div
                                        key={l.href}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={l.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="block px-3 py-2 rounded-lg text-sm transition-colors font-mono"
                                            style={{
                                                color: l.active ? "#fff" : "rgb(160 160 170)",
                                                background: l.active ? "rgba(80,140,230,0.08)" : "transparent",
                                                border: l.active ? "1px solid rgba(80,140,230,0.22)" : "1px solid transparent",
                                            }}
                                        >
                                            {l.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
