import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export default function Header() {
    const path = useLocation().pathname;
    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    /* Scroll-aware header background — fades from transparent to solid */
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 60], [0, 1]);
    const borderOpacity = useTransform(scrollY, [0, 60], [0, 1]);

    /* Sync search input with URL params */
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const termFromUrl = urlParams.get("searchTerm");
        if (termFromUrl) setSearchTerm(termFromUrl);
    }, [location.search]);

    const handleSearch = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm);
        navigate(`/search?${urlParams.toString()}`);
    };

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

    const navLinks = [
        { to: "/", label: "Home", active: path === "/" },
        { to: "/blog", label: "Blog", active: path === "/blog" || path.startsWith("/blog/") },
        { to: "/projects", label: "Projects", active: path === "/projects" },
        { to: "/resume", label: "Resume", active: path === "/resume" },
        { to: "/about", label: "About", active: path === "/about" },
    ];

    return (
        <header className="sticky top-0 z-40">
            {/* Animated bg that fades in on scroll */}
            <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 bg-black pointer-events-none" />
            <motion.div style={{ opacity: borderOpacity }} className="absolute bottom-0 left-0 right-0 h-px bg-neutral-800 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                    <Link to="/" className="text-white font-bold text-lg whitespace-nowrap shrink-0">
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
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-1.5 text-sm pr-9"
                        />
                        <AiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-base" />
                    </div>
                </form>

                {/* Desktop nav with animated active pill */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`relative px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                link.active ? "text-white" : "text-neutral-400 hover:text-white"
                            }`}
                        >
                            {link.active && (
                                <motion.span
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-neutral-900 rounded-lg"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10 flex flex-col items-center gap-0.5">
                                {link.label}
                                <motion.span
                                    className="h-px bg-blue-500 w-full origin-left"
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Right side: user or sign-in */}
                <div className="flex items-center gap-3 shrink-0">
                    {currentUser ? (
                        <Menu as="div" className="relative">
                            <MenuButton className="focus:outline-none">
                                <motion.img
                                    src={currentUser.profilePicture}
                                    alt="avatar"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="w-8 h-8 rounded-full object-cover border border-neutral-700 hover:border-blue-500 transition-colors"
                                />
                            </MenuButton>
                            <MenuItems className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl focus:outline-none overflow-hidden">
                                <div className="px-4 py-3 border-b border-neutral-800">
                                    <p className="text-white text-sm font-medium truncate">{currentUser.username}</p>
                                    <p className="text-neutral-500 text-xs truncate">{currentUser.email}</p>
                                </div>
                                <MenuItem>
                                    <Link to="/dashboard?tab=profile" className="block px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                                        Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <button onClick={handleSignout} className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors border-t border-neutral-800">
                                        Sign Out
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="rounded-lg"
                        >
                            <Link to="/sign-in" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-1.5 rounded-lg transition-colors block">
                                Sign In
                            </Link>
                        </motion.div>
                    )}

                    {/* Mobile hamburger with rotation animation */}
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

            {/* Mobile nav — animated slide down */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="md:hidden border-t border-neutral-800 bg-black overflow-hidden"
                    >
                        <div className="px-4 pb-4">
                            <form onSubmit={handleSearch} className="mt-3 mb-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm pr-9"
                                    />
                                    <AiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-base" />
                                </div>
                            </form>
                            <nav className="flex flex-col gap-1">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.to}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            to={link.to}
                                            onClick={() => setMobileOpen(false)}
                                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                                link.active ? "text-white bg-neutral-900" : "text-neutral-400 hover:text-white hover:bg-neutral-900"
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
