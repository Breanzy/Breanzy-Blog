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
        <div>
            {/* Hero section */}
            <div className="flex flex-col gap-6 px-3 p-28 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold lg:text-6xl">
                    Hi, I'm{" "}
                    <span className="px-2 py-1 bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 rounded-lg text-white">
                        Brean
                    </span>
                </h1>
                <p className="text-gray-500 text-sm sm:text-base max-w-2xl">
                    A full-stack developer who enjoys building things for the web.
                    I write about code, share what I'm working on, and document
                    what I've learned along the way.
                </p>
                <div className="flex gap-4 flex-wrap">
                    <Link
                        to="/projects"
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        View My Projects
                    </Link>
                    <Link
                        to="/blog"
                        className="px-6 py-2 border border-teal-500 text-teal-500 rounded-lg font-semibold hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Read My Blog
                    </Link>
                </div>
            </div>

            {/* Featured projects preview — only renders if there are featured projects */}
            {featuredProjects.length > 0 && (
                <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-semibold text-center">
                            Featured Projects
                        </h2>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {featuredProjects.map((project) => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                        <Link
                            to="/projects"
                            className="text-lg text-teal-500 hover:underline text-center"
                        >
                            View all projects
                        </Link>
                    </div>
                </div>
            )}

            {/* Recent blog posts preview */}
            {recentPosts.length > 0 && (
                <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-semibold text-center">
                            Recent Posts
                        </h2>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {recentPosts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        <Link
                            to="/blog"
                            className="text-lg text-teal-500 hover:underline text-center"
                        >
                            View all posts
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
