import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
    const [recentPosts, setRecentPosts] = useState([]);
    const [featuredProjects, setFeaturedProjects] = useState([]);

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
            {/* Hero */}
            <section className="max-w-6xl mx-auto px-4 py-28 flex flex-col gap-6">
                <p className="text-blue-500 text-sm font-medium tracking-widest uppercase">
                    Full-Stack Developer
                </p>
                <h1 className="text-4xl lg:text-7xl font-bold text-white leading-tight">
                    Hi, I'm{" "}
                    <span className="text-blue-500">Brean</span>
                </h1>
                <p className="text-neutral-400 text-base max-w-xl leading-relaxed">
                    I build things for the web — from full-stack applications to
                    personal tools. I write about what I learn and share it here.
                </p>
                <div className="flex gap-3 flex-wrap mt-2">
                    <Link
                        to="/projects"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
                    >
                        View My Projects
                    </Link>
                    <Link
                        to="/blog"
                        className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
                    >
                        Read My Blog
                    </Link>
                </div>
            </section>

            {/* Featured projects — only renders if there are featured projects */}
            {featuredProjects.length > 0 && (
                <section className="bg-neutral-950 py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-white text-2xl font-semibold">Featured Projects</h2>
                            <Link to="/projects" className="text-blue-500 hover:text-blue-400 text-sm transition-colors">
                                View all →
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {featuredProjects.map((project) => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Recent blog posts */}
            {recentPosts.length > 0 && (
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-white text-2xl font-semibold">Recent Posts</h2>
                            <Link to="/blog" className="text-blue-500 hover:text-blue-400 text-sm transition-colors">
                                View all →
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {recentPosts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
