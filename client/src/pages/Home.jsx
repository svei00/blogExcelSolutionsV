import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to Excel Solutionsv Blog
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you can find a variety of Excel topics from General to a more
          specific topics like accounting, data analysis, and mucho more!
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-blueEx font-bold hover:text-greenEx"
        >
          View All Post
        </Link>
      </div>
      <div className="p-3 bg-gray-100 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
        
        
      </div>
    </div>
  );
}
