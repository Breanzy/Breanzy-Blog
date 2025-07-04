import { Button, Navbar, TextInput, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {
    const path = useLocation().pathname;
    const location = useLocation();
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.theme);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const dispatch = useDispatch();
    const handleSignout = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <Navbar className="border-b-2">
            {/* Logo */}
            <Link
                to="/"
                className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
                Breanzy's
                <span className="px-2 py-1 ml-4 bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 rounded-lg text-white">
                    Blog
                </span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSubmit} className="flex-grow basis-0 p-2 max-w-[400px]">
                <TextInput
                    type="text"
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            <div className="flex gap-2 md:order-2">
                {/* Dark & Light Theme Button */}
                <Button
                    className="w-12 h-10 hidden sm:inline"
                    color="gray"
                    pill
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                </Button>

                {/* User Profile */}
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt="user"
                                img={currentUser.profilePicture}
                                rounded
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">
                                {currentUser.username}
                            </span>
                            <span className="block text-sm font-medium truncate">
                                {currentUser.email}
                            </span>
                        </Dropdown.Header>
                        <Link to={"/dashboard?tab=profile"}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignout}>
                            Sign Out
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to="/sign-in">
                        <Button gradientDuoTone="purpleToBlue" outline>
                            Sign-in
                        </Button>
                    </Link>
                )}

                {/* Navbar Hamburger Toggle */}
                <Navbar.Toggle />
            </div>
            {/* Navbar Collapsed Contents */}
            <Navbar.Collapse>
                <Navbar.Link active={path == "/"} as={"div"}>
                    <Link to="/">Home</Link>
                </Navbar.Link>

                <Navbar.Link active={path == "/about"} as={"div"}>
                    <Link to="/about">About</Link>
                </Navbar.Link>

                <Navbar.Link active={path == "/projects"} as={"div"}>
                    <Link to="/projects">Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
