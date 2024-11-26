import { Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonEx from "../components/Buttons";
import PostCard from "../components/PostCard";

export default function Search() {
  // State for sidebar filters
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc", // Default sort order
    category: "uncategorized", // Default category
  });

  console.log(sidebarData); // Debugging the state of sidebarData

  const [posts, setPosts] = useState([]); // Posts data
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [showMore, setShowMore] = useState(false); // Show More button toggle
  const [categories, setCategories] = useState([]); // Categories data

  const location = useLocation(); // Provides access to the current URL
  const navigate = useNavigate(); // Allows navigation programmatically

  useEffect(() => {
    // Parse the query parameters from the URL
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    // If any query parameters exist, update sidebarData accordingly
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    // Fetch posts based on the query parameters
    const fetchPosts = async () => {
      setLoading(true); // Start loading indicator
      const searchQuery = urlParams.toString(); // Serialize URL parameters
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false); // Stop loading if the fetch fails
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts); // Update posts state with the response data
        setLoading(false); // Stop loading once data is fetched
        setShowMore(data.posts.length === 9); // Determine if "Show More" is needed
      }
    };

    fetchPosts();
  }, [location.search]); // Re-run effect when the URL changes

  // Handles input changes for sidebar filters
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value, // Update the search term
      });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({
        ...sidebarData,
        sort: order, // Update the sort order
      });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({
        ...sidebarData,
        category, // Update the category
      });
    }
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/post/categories");
        const data = await res.json();
        setCategories(data); // Update categories state
      } catch (error) {
        console.error("Failed to fetch categories:", error); // Log errors
      }
    };

    fetchCategories();
  }, []); // Only runs on mount

  // Handles form submission to apply filters and update the URL
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form behavior
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`); // Navigate to the updated URL
  };

  // Handles "Show More" functionality to fetch additional posts
  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex); // Add startIndex to query params
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return; // Exit if the request fails
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]); // Append new posts to existing ones
      setShowMore(data.posts.length === 9); // Check if "Show More" is still needed
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-7 border-b md:border-r md:min-h-screen border-blueEx">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Search Term */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            {/* TextInput for search term */}
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            {/* Dropdown for sort options */}
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            {/* Dropdown for category options */}
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>

          {/* Apply Filters Button */}
          <ButtonEx title="Apply Filters" type="submit" outline />
        </form>
      </div>

      {/* Main Content */}
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-greenEx p-3 mt-5">
          Posts Results
        </h1>
        <div className="p-7 flex flex-wrap justify-center items-center gap-4">
          {/* Display message for no posts */}
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {/* Loading indicator */}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {/* Post cards */}
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
    </div>
  );
}
