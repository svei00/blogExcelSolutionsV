import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/LogoExcelv2_Trim_803x230.png";
import { AiOutlineSearch } from "react-icons/ai";
import { FaDesktop, FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, setTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import NavLinkEx from "./NavLinkEx";
import { categoryLabel } from "../config/categories";

// Detect System Preferences
const getSystemThemePreference = () => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  // console.log(searchTerm); // For testing purposes
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/post/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }

    // Theme Detection
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => {
      if (theme === "system") {
        if (mediaQuery.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    mediaQuery.addListener(handleThemeChange);
    handleThemeChange(); // Call it initially to set the correct theme
    return () => mediaQuery.removeListener(handleThemeChange);
  }, [location.search, theme, dispatch]);

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
      console.log(error.message);
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
    <Navbar className=" border-b-2 bg-white dark:bg-gray-900 transition-colors duration-300">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="flex items-end justify-center">
          <img src={logo} alt="Logo Excel Solutions" className="h-10" />
          <span className="text-secondary"> Blog</span>
        </span>
        {/* <span className="px-2 py-1 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
          Excel Solutions®
        </span>
        Blog */}
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // onKeyDown={(e) => {
          //   if (e.key === "Enter")
          // }}
        />
      </form>
      <Button
        className="w-12 h-10 lg:hidden"
        color="gray"
        pill
        onClick={handleSubmit}
      >
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <FaSun />
          ) : theme === "dark" ? (
            <FaMoon />
          ) : (
            <FaDesktop />
          )}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button className="bg-gradient-to-r from-primary to-secondary" outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        {/* Without cutom */}
        {/* <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link> */}

        {/* Custom NavBar */}
        <NavLinkEx to="/">Home</NavLinkEx>
        {categories.length > 0 && (
          <Dropdown
            arrowIcon={true}
            inline
            label={
              <span
                className={`font-bold ${
                  path === "/search"
                    ? "text-primary hover:text-secondary"
                    : "text-gray-400 hover:text-secondary"
                }`}
              >
                Categories
              </span>
            }
          >
            {categories.map((category) => (
              <Link key={category} to={`/search?category=${category}`}>
                <Dropdown.Item>{categoryLabel(category)}</Dropdown.Item>
              </Link>
            ))}
          </Dropdown>
        )}
        {/* Search itself was only reachable by typing into the top-right
            box (desktop) or a bare icon button (mobile, which submits an
            empty term and just lands on /search). Neither tells a reader
            "you can browse everything here" - a plain nav link does. */}
        <NavLinkEx to="/search">Search</NavLinkEx>
        <NavLinkEx to="/about">About</NavLinkEx>
        <NavLinkEx to="/projects">Projects</NavLinkEx>
      </Navbar.Collapse>
    </Navbar>
  );
}
