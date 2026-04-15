"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "@/redux/user/userSlice";
import { useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { RootState } from "@/redux/store";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { currentUser } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    /* Scroll-aware header background — fades from transparent to solid */
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 60], [0, 1]);
    const borderOpacity = useTransform(scrollY, [0, 60], [0, 1]);

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

    const navLinks = [
        { href: "/", label: "Home", active: pathname === "/" },
        { href: "/blog", label: "Blog", active: pathname === "/blog" || pathname.startsWith("/blog/") },
        { href: "/projects", label: "Projects", active: pathname === "/projects" },
        { href: "/resume", label: "Resume", active: pathname === "/resume" },
        { href: "/about", label: "About", active: pathname === "/about" },
    ];

    return (
        <header className="sticky top-0 z-40">
            {/* Animated glass bg that fades in on scroll */}
            <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 bg-black/60 backdrop-blur-xl pointer-events-none" />
            <motion.div style={{ opacity: borderOpacity }} className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}>
                    <Link href="/" className="text-white font-bold text-lg whitespace-nowrap shrink-0">
                        Brean<span className="text-blue-500">zy</span>
                    </Link>
                </motion.div>

                {/* Search — hidden on mobile */}
                <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-sm">
                    <div className="relative w-full">
                        <motion.input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                            className="w-full bg-black/40 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600/60 rounded-lg px-3 py-1.5 text-sm pr-9 backdrop-blur-sm"
                        />
                        <AiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-base" />
                    </div>
                </form>

                {/* Desktop nav with animated active pill */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                link.active ? "text-white" : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            {link.active && (
                                <motion.span
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-white/[0.08] backdrop-blur-sm border border-white/10 rounded-lg"
                                    transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10">{link.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Right side: user or sign-in */}
                <div className="flex items-center gap-3 shrink-0">
                    {currentUser ? (
                        <Menu as="div" className="relative">
                            <MenuButton className="focus:outline-none">
                                <motion.div
                                    className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-700 hover:border-blue-500 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                                >
                                    <Image src={currentUser.profilePicture} alt="avatar" fill className="object-cover" sizes="32px" />
                                </motion.div>
                            </MenuButton>
                            <MenuItems className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-2xl focus:outline-none overflow-hidden">
                                <div className="px-4 py-3 border-b border-white/[0.06]">
                                    <p className="text-white text-sm font-medium truncate">{currentUser.username}</p>
                                    <p className="text-neutral-500 text-xs truncate">{currentUser.email}</p>
                                </div>
                                <MenuItem>
                                    <Link href="/dashboard?tab=profile" className="block px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/[0.06] hover:text-white transition-colors">
                                        Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <button onClick={handleSignout} className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/[0.06] hover:text-white transition-colors border-t border-white/[0.06]">
                                        Sign Out
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                            className="rounded-lg"
                        >
                            <Link href="/sign-in" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-1.5 rounded-lg transition-colors block">
                                Sign In
                            </Link>
                        </motion.div>
                    )}

                    {/* Mobile hamburger */}
                    <motion.button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        animate={{ rotate: mobileOpen ? 90 : 0 }}
                        transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                        className="md:hidden text-neutral-400 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <HiX className="text-xl" /> : <HiMenuAlt3 className="text-xl" />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile nav — animated slide down */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="md:hidden border-t border-white/[0.06] bg-black/70 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="px-4 pb-4">
                            <form onSubmit={handleSearch} className="mt-3 mb-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600/60 rounded-lg px-3 py-2 text-sm pr-9"
                                    />
                                    <AiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-base" />
                                </div>
                            </form>
                            <nav className="flex flex-col gap-1">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                                link.active ? "text-white bg-white/[0.08] border border-white/10" : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                                            }`}
                                        >
                                            {link.label}
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
