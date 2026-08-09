import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Spinner } from "flowbite-react";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import HeaderLayout from "./components/HeaderLayout";
import Analytics from "./components/Analytics";
import { HelmetProvider, Helmet } from "react-helmet-async";
import useLocale from "./hooks/useLocale";

// Code-split the pages a reader never needs: signing in/up and every
// admin page (dashboard, create/update post) pull in real weight -
// Toast UI editor, dashboard tables/charts - that a reader just
// browsing posts shouldn't have to download (REBUILD_PLAN 4.1).
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const UpdatePost = lazy(() => import("./pages/UpdatePost"));

function RouteFallback() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Spinner size="xl" />
    </div>
  );
}

export default function App() {
  const { locale } = useLocale();

  // REBUILD_PLAN 12.A.2/12.A.3 - keep <html lang> honest for the active
  // locale. Set directly rather than through <Helmet htmlAttributes>:
  // this app's react-helmet-async setup doesn't reconcile that Helmet at
  // all (the <title>/<meta> it declares never reach the DOM either), and
  // <html lang> is a single attribute this code is the sole owner of, so
  // a plain effect is both simpler and actually works. Client-side
  // counterpart of 12.B.4's server-side per-URL lang; both must agree.
  // index.html ships lang="es" for the no-JS / crawler case.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Helmet>
          <title>ExcelSolutionsV Blog</title>
          <meta name="description" content="Welcome to ExcelSolutionsV Blog!" />
        </Helmet>
        <ScrollToTop />
        <Analytics />
        {/* Skip link (REBUILD_PLAN 7.3) - sr-only until focused, so a
            keyboard user's first Tab lands here instead of having to
            step through every header link before reaching content. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-white dark:focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-primaryText dark:focus:text-primary focus:shadow-lg"
        >
          Skip to main content
        </a>
        <HeaderLayout>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/search" element={<Search />} />
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route element={<OnlyAdminPrivateRoute />}>
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/update-post/:postId" element={<UpdatePost />} />
              </Route>
              <Route path="/projects" element={<Projects />} />
              <Route path="/post/:postSlug" element={<PostPage />} />
            </Routes>
          </Suspense>
        </HeaderLayout>
        <Footer />
      </BrowserRouter>
    </HelmetProvider>
  );
}
