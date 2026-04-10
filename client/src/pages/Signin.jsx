import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { motion } from "framer-motion";
import OAuth from "../components/OAuth";

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error: errorMessage } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(signInStart());
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) { dispatch(signInFailure(data.message)); return; }
            if (res.ok) { dispatch(signInSuccess(data)); navigate("/"); }
        } catch {
            dispatch(signInFailure("Something went wrong"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-8"
            >
                <Link to="/" className="block text-center text-white font-bold text-2xl mb-2">
                    Brean<span className="text-blue-500">zy</span>
                </Link>
                <p className="text-center text-neutral-500 text-sm mb-8">
                    Sign in with your email or Google
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-neutral-400 text-sm">Email</label>
                        <motion.input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            onChange={handleChange}
                            required
                            whileFocus={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-neutral-400 text-sm">Password</label>
                        <motion.input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                            whileFocus={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" } : {}}
                        whileTap={!loading ? { scale: 0.96 } : {}}
                        animate={{ opacity: loading ? 0.7 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="bg-blue-600 hover:bg-blue-500 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Signing in...
                            </>
                        ) : "Sign In"}
                    </motion.button>

                    <OAuth />
                </form>

                {errorMessage && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-red-400 text-sm text-center"
                    >
                        {errorMessage}
                    </motion.p>
                )}

                <p className="mt-6 text-center text-neutral-500 text-sm">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="text-blue-500 hover:text-blue-400 transition-colors">
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
