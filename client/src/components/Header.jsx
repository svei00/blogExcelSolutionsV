import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/LogoExcelv2_Trim_803x230.png";
import { AiOutlineSearch } from "react-icons/ai";
import { FaDesktop, FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, setTheme } from "../redux/theme/themeSlice";
import { toggleLocale } from "../redux/locale/localeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import NavLinkEx from "./NavLinkEx";
import useLocale from "../hooks/useLocale";

// REBUILD_PLAN 12.A.5 - chrome strings as { es, en } pairs.
const ui = {
  searchPlaceholder: { es: "Buscar...", en: "Search..." },
  searchAria: { es: "Buscar", en: "Search" },
  navHome: { es: "Inicio", en: "Home" },
  navSearch: { es: "Buscar", en: "Search" },
  navAbout: { es: "Acerca de", en: "About" },
  navProjects: { es: "Proyectos", en: "Projects" },
  profile: { es: "Perfil", en: "Profile" },
  signOut: { es: "Cerrar sesión", en: "Sign Out" },
  signIn: { es: "Iniciar sesión", en: "Sign In" },
  mobileLocale: { es: "Idioma", en: "Language" },
  mobileTheme: { es: "Tema", en: "Theme" },
};

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
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const { locale } = useSelector((state) => state.locale);
  const { t } = useLocale();
  const [searchTerm, setSearchTerm] = useState("");
  // console.log(searchTerm); // For testing purposes

  // Floating pill navbar on scroll (REBUILD_PLAN 6.9, Upscayl-style).
  // Passive listener - scroll handlers block the compositor thread if
  // not marked passive. Fires once on mount too, so a mid-page reload
  // (or a client-side nav landing scrolled) starts in the right visual
  // state instead of waiting for the next scroll event.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    // Raised from 40 - at 40 the pill kicked in on the very first nudge
    // of the page, which read as twitchy/aggressive rather than a
    // response to an actual scroll gesture.
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    <Navbar
      // pointer-events-auto: re-enables clicks that HeaderLayout's fixed
      // wrapper deliberately turns off (see the comment there) - applied
      // to the Navbar itself, not a full-width div, so the transparent
      // margin beside a shrunk pill never blocks the content under it.
      // w-[calc(100%-2rem)] + max-w-6xl + mx-auto: full-width bar when
      // not scrolled (calc result exceeds max-w-6xl on any real
      // viewport, so max-w-6xl doesn't engage); once scrolled, side
      // margins on mobile and a centered 6xl-wide pill on larger screens.
      // max-w-6xl (was 5xl) + duration-500 ease-out (was 300, default
      // ease) + shadow-md (was shadow-lg): the transform itself was
      // fine, but a sharp 300ms snap into a noticeably narrower, more
      // heavily-shadowed shape read as aggressive - widening the target
      // shape and slowing/softening the easing makes it a glide instead
      // of a jump, without changing what it settles into.
      className={`pointer-events-auto transition-all duration-500 ease-out ${
        scrolled
          ? "mt-2 w-[calc(100%-2rem)] max-w-6xl mx-auto rounded-2xl md:rounded-full border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md"
          : "w-full border-b-2 bg-white dark:bg-gray-900"
      }`}
    >
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="flex items-end justify-center">
          <img src={logo} alt="Logo Excel Solutions" className="h-10" />
          <span className="text-secondaryText dark:text-secondary"> Blog</span>
        </span>
        {/* <span className="px-2 py-1 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
          Excel Solutions®
        </span>
        Blog */}
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder={t(ui.searchPlaceholder)}
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
        aria-label={t(ui.searchAria)}
      >
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        {/* Language toggle (REBUILD_PLAN 12.A.3), beside the theme button.
            Mobile access closed in 12.A.5 - see the sm:hidden <li> pair
            in Navbar.Collapse below, which covers exactly the width
            range this button hides itself in.
            TODO(12.B.1): once /en/* routes exist this must NAVIGATE to the
            counterpart URL - and render as a <Link> so a crawler follows
            the alternate - not just flip state; the URL is authoritative
            from 12.B on. State-only here because no counterpart URL
            exists yet. */}
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleLocale())}
          aria-label={
            locale === "es"
              ? "Idioma: español. Cambiar a English."
              : "Idioma: English. Cambiar a español."
          }
        >
          <span className="text-xs font-bold">{locale.toUpperCase()}</span>
        </Button>
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
          aria-label={`Theme: ${theme}. Click to change.`}
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
              <Dropdown.Item>{t(ui.profile)}</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>{t(ui.signOut)}</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button
              className="bg-gradient-to-r from-primary to-secondary"
              outline
              tabIndex={-1}
            >
              {t(ui.signIn)}
            </Button>
          </Link>
        )}

        {/* type="button" - Flowbite's NavbarToggle doesn't set one itself,
            so it defaults to type="submit" (found during a 7.3 keyboard
            audit). Harmless today with no enclosing <form>, but wrong
            semantics for a non-submit toggle button - explicit fix rather
            than relying on there never being a form ancestor later. */}
        <Navbar.Toggle type="button" />
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

        {/* Custom NavBar - each item wrapped in <li> because
            Navbar.Collapse renders a <ul>, and a <ul> may only contain
            <li> (REBUILD_PLAN 7.5 audit: axe "list" violation). */}
        <li>
          <NavLinkEx to="/">{t(ui.navHome)}</NavLinkEx>
        </li>
        {/* Categories dropdown removed (REBUILD_PLAN search redesign) -
            a flat list of a dozen+ categories doesn't scale as a nav
            menu, and it duplicated what /search's toolbar now does
            better. Category browsing lives on /search only. */}
        {/* Search itself was only reachable by typing into the top-right
            box (desktop) or a bare icon button (mobile, which submits an
            empty term and just lands on /search). Neither tells a reader
            "you can browse everything here" - a plain nav link does. */}
        <li>
          <NavLinkEx to="/search">{t(ui.navSearch)}</NavLinkEx>
        </li>
        <li>
          <NavLinkEx to="/about">{t(ui.navAbout)}</NavLinkEx>
        </li>
        <li>
          <NavLinkEx to="/projects">{t(ui.navProjects)}</NavLinkEx>
        </li>
        {/* REBUILD_PLAN 12.A.5 - closes the 12.A.3 TODO: the top-bar
            language/theme buttons are `hidden sm:inline`, so below the
            sm breakpoint neither was reachable at all. Duplicated here
            as plain list items, gated `sm:hidden` so they disappear
            the instant the top-bar versions appear - no double
            controls at any width. */}
        <li className="sm:hidden">
          <button
            type="button"
            onClick={() => dispatch(toggleLocale())}
            className="flex items-center gap-2 font-bold text-gray-500 dark:text-gray-400 hover:text-secondaryText dark:hover:text-secondary"
          >
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
              {locale.toUpperCase()}
            </span>
            {t(ui.mobileLocale)}
          </button>
        </li>
        <li className="sm:hidden">
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            className="flex items-center gap-2 font-bold text-gray-500 dark:text-gray-400 hover:text-secondaryText dark:hover:text-secondary"
          >
            {theme === "light" ? (
              <FaSun />
            ) : theme === "dark" ? (
              <FaMoon />
            ) : (
              <FaDesktop />
            )}
            {t(ui.mobileTheme)}
          </button>
        </li>
      </Navbar.Collapse>
    </Navbar>
  );
}
