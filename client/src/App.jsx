import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Spinner } from "flowbite-react";
import Home from "./pages/Home";
import About from "./pages/About";
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
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Helmet>
          <title>ExcelSolutionsV Blog</title>
          <meta name="description" content="Welcome to ExcelSolutionsV Blog!" />
        </Helmet>
        <ScrollToTop />
        <Analytics />
        <HeaderLayout>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
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
