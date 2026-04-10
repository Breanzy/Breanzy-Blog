import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import OAuth from "../components/OAuth";

export default function Signup() {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setErrorMessage(null);
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) { return setErrorMessage(data.message); }
            if (res.ok) navigate("/sign-in");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
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
                    Create your account
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {[
                        { id: "username", type: "text", label: "Username", placeholder: "yourname" },
                        { id: "email", type: "email", label: "Email", placeholder: "you@example.com" },
                        { id: "password", type: "password", label: "Password", placeholder: "••••••••" },
                    ].map((field) => (
                        <div key={field.id} className="flex flex-col gap-1">
                            <label htmlFor={field.id} className="text-neutral-400 text-sm">{field.label}</label>
                            <motion.input
                                id={field.id}
                                type={field.type}
                                placeholder={field.placeholder}
                                onChange={handleChange}
                                required
                                whileFocus={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    ))}

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
                                Creating account...
                            </>
                        ) : "Sign Up"}
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
                    Already have an account?{" "}
                    <Link to="/sign-in" className="text-blue-500 hover:text-blue-400 transition-colors">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
