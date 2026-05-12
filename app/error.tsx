"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="bg-black min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <p className="text-red-500 text-sm font-medium tracking-widest uppercase mb-3">Error</p>
                <h1 className="text-4xl font-bold text-white mb-3">Something went wrong</h1>
                <p className="text-neutral-400 text-sm mb-8 max-w-xs mx-auto">
                    An unexpected error occurred. Try refreshing the page.
                </p>
                <button
                    onClick={reset}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
                >
                    Try again
                </button>
            </div>
        </main>
    );
}
