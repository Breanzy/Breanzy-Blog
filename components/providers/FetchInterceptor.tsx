"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "@/redux/user/userSlice";

// Patches window.fetch to auto-signout on 401/403 responses
export default function FetchInterceptor() {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const originalFetch = window.fetch.bind(window);

        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            if (response.status === 401 || response.status === 403) {
                dispatch(signoutSuccess());
                router.push("/sign-in");
            }
            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [dispatch, router]);

    return null;
}
