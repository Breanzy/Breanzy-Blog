import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "./redux/user/userSlice";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import Blog from "./pages/Blog";
import Resume from "./pages/Resume";

/* Inner layout — useLocation must live inside BrowserRouter */
function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Intercept any 401/403 API response — cookie expired or invalid
    useEffect(() => {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const res = await originalFetch(...args);
            if ((res.status === 401 || res.status === 403) && String(args[0]).startsWith("/api")) {
                dispatch(signoutSuccess());
                navigate("/sign-in");
            }
            return res;
        };
        return () => { window.fetch = originalFetch; };
    }, [dispatch, navigate]);
    return (
        <>
            <Header />
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                >
                    <ScrollToTop />
                    <Routes location={location}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/sign-in" element={<Signin />} />
                        <Route path="/sign-up" element={<Signup />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/resume" element={<Resume />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                        <Route element={<OnlyAdminPrivateRoute />}>
                            <Route path="/create-post" element={<CreatePost />} />
                            <Route path="/update-post/:postId" element={<UpdatePost />} />
                        </Route>
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/blog/:postSlug" element={<PostPage />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
            <Footer />
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}
