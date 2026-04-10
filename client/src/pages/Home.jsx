import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PostCard from "../components/PostCard";
import ProjectCard from "../components/ProjectCard";
import FadeIn from "../components/FadeIn";

/* Stagger variants for card grids */
const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};
const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

/* Hero stagger variants */
const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const heroItem = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

export default function Home() {
    const [recentPosts, setRecentPosts] = useState([]);
    const [featuredProjects, setFeaturedProjects] = useState([]);

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    /* Parallax — text drifts up 150px as hero scrolls out of view */
    const heroY = useTransform(scrollYProgress, [0, 1], [0, -150]);

    // Fetch 3 most recent blog posts
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch("/api/post/getPosts?limit=3");
            const data = await res.json();
            if (res.ok) setRecentPosts(data.posts);
        };
        fetchPosts();
    }, []);

    // Fetch featured projects for the preview section
    useEffect(() => {
        const fetchFeatured = async () => {
            const res = await fetch("/api/project/getprojects?featured=true&limit=3");
            const data = await res.json();
            if (res.ok) setFeaturedProjects(data.projects);
        };
        fetchFeatured();
    }, []);

    return (
        <div className="bg-black">
            {/* Hero with parallax */}
            <section ref={heroRef} className="relative overflow-hidden min-h-[70vh] flex items-center">
                <motion.div style={{ y: heroY }} className="max-w-6xl mx-auto px-4 py-28 flex flex-col gap-6 w-full">
                    <motion.div variants={heroContainer} initial="hidden" animate="show">
                        <motion.p variants={heroItem} className="text-blue-500 text-sm font-medium tracking-widest uppercase mb-2">
                            Full-Stack Developer
                        </motion.p>
                        <motion.h1 variants={heroItem} className="text-4xl lg:text-7xl font-bold text-white leading-tight mb-4">
                            Hi, I'm{" "}
                            <span className="text-blue-500">Brean</span>
                        </motion.h1>
                        <motion.p variants={heroItem} className="text-neutral-400 text-base max-w-xl leading-relaxed mb-6">
                            I build things for the web — from full-stack applications to
                            personal tools. I write about what I learn and share it here.
                        </motion.p>
                        <motion.div variants={heroItem} className="flex gap-3 flex-wrap">
                            <motion.div
                                whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="rounded-lg"
                            >
                                <Link to="/projects" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors block">
                                    View My Projects
                                </Link>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="rounded-lg"
                            >
                                <Link to="/blog" className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white font-medium px-6 py-2.5 rounded-lg transition-colors block">
                                    Read My Blog
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Featured projects — only renders if there are featured projects */}
            {featuredProjects.length > 0 && (
                <section className="bg-neutral-950 py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <FadeIn className="flex items-center justify-between mb-8">
                            <h2 className="text-white text-2xl font-semibold">Featured Projects</h2>
                            <Link to="/projects" className="text-blue-500 hover:text-blue-400 text-sm transition-colors">
                                View all →
                            </Link>
                        </FadeIn>
                        <motion.div
                            className="flex flex-wrap gap-4 justify-center"
                            variants={gridVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-80px" }}
                        >
                            {featuredProjects.map((project) => (
                                <motion.div key={project._id} variants={cardVariant}>
                                    <ProjectCard project={project} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Recent blog posts */}
            {recentPosts.length > 0 && (
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <FadeIn className="flex items-center justify-between mb-8">
                            <h2 className="text-white text-2xl font-semibold">Recent Posts</h2>
                            <Link to="/blog" className="text-blue-500 hover:text-blue-400 text-sm transition-colors">
                                View all →
                            </Link>
                        </FadeIn>
                        <motion.div
                            className="flex flex-wrap gap-4 justify-center"
                            variants={gridVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-80px" }}
                        >
                            {recentPosts.map((post) => (
                                <motion.div key={post._id} variants={cardVariant}>
                                    <PostCard post={post} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}
        </div>
    );
}
