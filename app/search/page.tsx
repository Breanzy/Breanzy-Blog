import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata = {
    title: "Search",
    description: "Browse and search posts by keyword, sort, and category.",
};

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <SearchClient />
        </Suspense>
    );
}
