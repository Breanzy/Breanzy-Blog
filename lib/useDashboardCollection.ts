"use client";

import { useEffect, useState } from "react";

type DashboardCollectionOptions = {
    enabled: boolean;
    initialUrl: string;
    pageUrl: (startIndex: number) => string;
    resultKey: string;
    pageSize?: number;
};

/* Loads and mutates a paginated dashboard collection behind one small interface. */
export function useDashboardCollection<T extends { _id: string }>({
    enabled,
    initialUrl,
    pageUrl,
    resultKey,
    pageSize = 9,
}: DashboardCollectionOptions) {
    const [items, setItems] = useState<T[]>([]);
    const [showMore, setShowMore] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /* Fetches the first page whenever the dashboard collection becomes available. */
        const fetchInitial = async () => {
            setLoading(true);
            try {
                const res = await fetch(initialUrl);
                const data = await res.json();
                if (res.ok) {
                    const nextItems = data[resultKey] || [];
                    setItems(nextItems);
                    setShowMore(nextItems.length >= pageSize);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        if (enabled) fetchInitial();
    }, [enabled, initialUrl, pageSize, resultKey]);

    /* Fetches the next page and appends it to the visible dashboard collection. */
    const loadMore = async () => {
        try {
            const res = await fetch(pageUrl(items.length));
            const data = await res.json();
            if (res.ok) {
                const nextItems = data[resultKey] || [];
                setItems((prev) => [...prev, ...nextItems]);
                setShowMore(nextItems.length >= pageSize);
            }
        } catch (error) {
            console.log(error);
        }
    };

    /* Removes a deleted item from local dashboard state without refetching. */
    const removeById = (id: string) => {
        setItems((prev) => prev.filter((item) => item._id !== id));
    };

    return { items, setItems, showMore, loading, loadMore, removeById };
}
