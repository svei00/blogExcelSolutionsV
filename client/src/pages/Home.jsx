import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import ButtonEx from "../components/Buttons";
import { categoryLabel } from "../config/categories";
import trackCtaClick from "../utils/trackCtaClick";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

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

  // Newest post doubles as the hero's featured panel (posts is already
  // createdAt-descending post-6.6) - excluded from the grid below so it
  // isn't shown twice on the same page.
  const [featuredPost, ...restPosts] = posts;

  return (
    <div>
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-3 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold lg:text-5xl">
            Excel Skills That Solve Real Work Problems
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
            Step-by-step tutorials on formulas, automation, and data
            analysis — including CFDI and SAT workflows for Mexican
            accountants. No fluff, just spreadsheets that work.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonEx title="Browse Articles" to="/search" />
            <ButtonEx
              title="Get Excel Help"
              to="/contact"
              outline
              onClick={() => trackCtaClick("hero")}
            />
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {categories.map((category) => (
                <Link key={category} to={`/search?category=${category}`}>
                  <Button color="gray" pill size="xs">
                    {categoryLabel(category)}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>

        {featuredPost && (
          <Link
            to={`/post/${featuredPost.slug}`}
            className="group block rounded-xl overflow-hidden shadow-elevation-md dark:ring-1 dark:ring-white/10"
          >
            <img
              src={featuredPost.image}
              alt={featuredPost.imageAlt || featuredPost.title}
              className="w-full aspect-video object-cover"
            />
            <div className="p-4 bg-gray-50 dark:bg-gray-800">
              <span className="text-xs uppercase tracking-wide text-secondary font-semibold">
                Latest Article
              </span>
              <h2 className="text-lg font-semibold mt-1 group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h2>
            </div>
          </Link>
        )}
      </div>

      {/* Recent Posts Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {restPosts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            {/* Center the posts */}
            <div className="flex flex-wrap justify-center gap-4">
              {restPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            {/* View All Posts Link */}
            <Link
              to="/search"
              className="text-lg font-semibold text-secondary hover:text-primary text-center"
            >
              View all Posts
            </Link>
          </div>
        )}
      </div>

      {/* Call-to-Action Section */}
      <div className="p-3 bg-gray-100 dark:bg-gray-800">
        <CallToAction ctaId="band" />
      </div>
    </div>
  );
}
