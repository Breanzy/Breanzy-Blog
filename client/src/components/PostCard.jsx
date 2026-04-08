import { Link } from "react-router-dom";

/* Card for displaying a blog post preview */
export default function PostCard({ post }) {
    return (
        <div className="group relative w-full sm:w-[430px] bg-neutral-900 border border-neutral-800 hover:border-blue-600 transition-all h-[400px] overflow-hidden rounded-xl">
            <Link to={`/blog/${post.slug}`}>
                <img
                    src={post.image}
                    alt="post cover"
                    className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300"
                />
                <div className="p-3 flex flex-col gap-2">
                    <p className="text-white text-lg font-semibold line-clamp-2">{post.title}</p>
                    <span className="text-neutral-500 italic text-sm">{post.category}</span>
                    <Link
                        to={`/blog/${post.slug}`}
                        className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300 text-center py-2 rounded-b-xl m-0"
                    >
                        Read article
                    </Link>
                </div>
            </Link>
        </div>
    );
}
