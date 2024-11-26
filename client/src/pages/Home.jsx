import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonEx from "../components/Buttons";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]); // State for storing posts
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [showMore, setShowMore] = useState(false); // Show More button toggle
  const navigate = useNavigate(); // Allows programmatic navigation

  // Fetch initial posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Start the loading indicator
      const res = await fetch("/api/post/getposts");
      if (!res.ok) {
        setLoading(false); // Stop loading if the fetch fails
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts); // Update posts state with fetched data
        setLoading(false); // Stop loading once the data is retrieved
        setShowMore(data.posts.length === 9); // Show More button if results are exactly 9
      }
    };

    fetchPosts();
  }, []); // Dependency array empty, runs only once on mount

  // Navigate to the search page
  const handleSearchClick = () => {
    navigate("/search"); // Redirect to the Search page
  };

  // Fetch additional posts for "Show More" functionality
  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts; // Determine starting index for next fetch
    const res = await fetch(`/api/post/getposts?startIndex=${startIndex}`);
    if (!res.ok) {
      return; // Exit if the request fails
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]); // Append new posts to existing ones
      setShowMore(data.posts.length === 9); // Update Show More button state
    }
  };

  return (
    <div className="p-7">
      {/* Header */}
      <h1 className="text-3xl font-semibold sm:border-b border-greenEx p-3 mt-5">
        Welcome to Our Blog
      </h1>

      {/* Search button */}
      <div className="p-5 flex justify-center">
        <ButtonEx title="Search" onClick={handleSearchClick} outline />
      </div>

      {/* Posts Section */}
      <div className="p-7 flex flex-wrap gap-4">
        {/* Message for no posts */}
        {!loading && posts.length === 0 && (
          <p className="text-xl text-gray-500">No posts available.</p>
        )}
        {/* Loading indicator */}
        {loading && <p className="text-xl text-gray-500">Loading...</p>}
        {/* Display posts */}
        {!loading &&
          posts &&
          posts.map((post) => <PostCard key={post._id} post={post} />)}
        {/* Show More button */}
        {showMore && (
          <button
            onClick={handleShowMore}
            className="text-greenEx text-lg hover:text-blueEx p-7 w-full"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
