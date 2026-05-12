import Link from "next/link";

export default function NotFound() {
    return (
        <main className="bg-black min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <p className="text-blue-500 text-sm font-medium tracking-widest uppercase mb-3">404</p>
                <h1 className="text-4xl font-bold text-white mb-3">Page not found</h1>
                <p className="text-neutral-400 text-sm mb-8 max-w-xs mx-auto">
                    The page you're looking for doesn't exist or may have been moved.
                </p>
                <Link
                    href="/"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
                >
                    Back to home
                </Link>
            </div>
        </main>
    );
}
