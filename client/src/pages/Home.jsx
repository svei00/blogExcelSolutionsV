import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to Excel Solutions Blog
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you can find a variety of Excel topics from general to more
          specific ones like accounting, data analysis, and much more!
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-blueEx font-bold hover:text-greenEx"
        >
          View all Posts
        </Link>
      </div>

      {/* Call-to-Action Section */}
      <div className="p-3 bg-gray-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      {/* Recent Posts Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            {/* Center the posts */}
            <div className="flex flex-wrap justify-center gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            {/* View All Posts Link */}
            <Link
              to="/search"
              className="text-lg font-semibold text-greenEx hover:text-blueEx text-center"
            >
              View all Posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
