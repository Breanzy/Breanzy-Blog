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
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <motion.button
            type="button"
            onClick={handleGoogleClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
            className="w-full flex items-center justify-center gap-2 border border-neutral-700 hover:border-blue-600 text-neutral-300 hover:text-white py-2 rounded-lg transition-colors text-sm"
        >
            <AiFillGoogleCircle className="text-xl" />
            Continue with Google
        </motion.button>
    );
}
