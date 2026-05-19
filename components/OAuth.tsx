"use client";

import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "@/firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "@/redux/user/userSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const idToken = await resultsFromGoogle.user.getIdToken();
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idToken,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Google sign-in failed");
            dispatch(signInSuccess(data));
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg text-sm text-neutral-300 hover:text-white transition-all backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
            <AiFillGoogleCircle className="text-xl" />
            continue with google
        </button>
    );
}
