import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import HeaderLayout from "./components/HeaderLayout";
import { HelmetProvider, Helmet } from "react-helmet-async";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Helmet>
          <title>ExcelSolutionsV Blog</title>
          <meta name="description" content="Welcome to ExcelSolutionsV Blog!" />
          {/* Google AdSense meta tag */}
          <meta
            name="google-adsense-account"
            content="ca-pub-5050087617356218"
          />
        </Helmet>
        <ScrollToTop />
        <HeaderLayout>
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
        </HeaderLayout>
        <Footer />
      </BrowserRouter>
    </HelmetProvider>
  );
}
