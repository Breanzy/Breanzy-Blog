import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
            if (data.success === false) {
                return setErrorMessage(data.message);
            }
            if (res.ok) navigate("/sign-in");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-8">
                {/* Logo */}
                <Link to="/" className="block text-center text-white font-bold text-2xl mb-2">
                    Brean<span className="text-blue-500">zy</span>
                </Link>
                <p className="text-center text-neutral-500 text-sm mb-8">
                    Create your account
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="text-neutral-400 text-sm">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="yourname"
                            onChange={handleChange}
                            required
                            className="bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-neutral-400 text-sm">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            onChange={handleChange}
                            required
                            className="bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-neutral-400 text-sm">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                            className="bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating account...
                            </>
                        ) : "Sign Up"}
                    </button>

                    <OAuth />
                </form>

                {errorMessage && (
                    <p className="mt-4 text-red-400 text-sm text-center">{errorMessage}</p>
                )}

                <p className="mt-6 text-center text-neutral-500 text-sm">
                    Already have an account?{" "}
                    <Link to="/sign-in" className="text-blue-500 hover:text-blue-400 transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
