import { Dropdown } from "flowbite-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { HiChevronDown, HiOutlineSearch } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import PostViewToggle from "../components/PostViewToggle";
import useCategories from "../hooks/useCategories";
import useViewPreference from "../hooks/useViewPreference";

// Sentinel for "no category filter" - deliberately NOT "uncategorized",
// which is a real category value (posts explicitly tagged as having
// none). Using it as the default meant every filter change pushed
// category=uncategorized into the URL even though the user never chose
// it, silently filtering the results down to zero posts (REBUILD_PLAN
// 11.A.6 - confirmed live: getposts?category=uncategorized returned
// posts: [] against 14 real posts).
const ALL_CATEGORIES = "all";

// A native <select>'s CLOSED box can be restyled with appearance-none,
// but its OPEN option list is a separate browser-native popup that no
// amount of CSS reaches - it renders with the browser's own light/dark
// palette (color-scheme), independently of any class on the <select>,
// which is why that popup kept showing up unreadable in dark mode no
// matter what was tried there. Flowbite's Dropdown/Dropdown.Item sidesteps
// the whole problem: the "popup" is just a Tailwind-styled <div>, so it's
// exactly as dark-mode-correct as any other element on the page - the
// same component already used for the header's Sign-in menu without any
// of these issues.
function ToolbarDropdown({ id, label, value, options, onChange }) {
  const current = options.find((option) => option.value === value);
  return (
    <Dropdown
      inline
      arrowIcon={false}
      label={
        <span className="flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-xs hover:border-gray-400 dark:hover:border-gray-500">
          <span className="font-mono uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {current?.label ?? value}
          </span>
          <HiChevronDown
            aria-hidden="true"
            className="h-3 w-3 text-gray-500 dark:text-gray-400"
          />
        </span>
      }
    >
      {options.map((option) => (
        <Dropdown.Item key={option.value} onClick={() => onChange(id, option.value)}>
          {option.label}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}

ToolbarDropdown.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function Search() {
  const [view, setView] = useViewPreference();
  // State for toolbar filters
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc", // Default sort order
    category: ALL_CATEGORIES, // Default: no category filter
  });

  const [posts, setPosts] = useState([]); // Posts data
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [showMore, setShowMore] = useState(false); // Show More button toggle
  const categories = useCategories(); // Shared with Footer.jsx - REBUILD_PLAN 11.A.6

  const location = useLocation(); // Provides access to the current URL
  const navigate = useNavigate(); // Allows navigation programmatically

  useEffect(() => {
    // Parse the query parameters from the URL
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    // "order", not "sort" - post.controller.js's getposts reads
    // req.query.order (comment/user controllers use "sort" instead, an
    // inconsistency nobody caught because sending the wrong key just
    // silently defaults to desc rather than erroring). The "Orden"
    // dropdown has been a no-op for "Antiguos" until this fix.
    const sortFromUrl = urlParams.get("order");
    const categoryFromUrl = urlParams.get("category");

    // If any query parameters exist, update sidebarData accordingly
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || ALL_CATEGORIES,
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

  // Search term just updates local state as the user types - it applies
  // on Enter (form submit), not per keystroke.
  const handleSearchTermChange = (e) => {
    setSidebarData({ ...sidebarData, searchTerm: e.target.value });
  };

  // Builds the URL from a given filter set and navigates - the one
  // place that turns "filters" into "the query that actually ran".
  // ALL_CATEGORIES is deliberately never written to the URL - the API
  // has no "all" concept, only "filter by this value" (omit the param
  // entirely) or "filter by category=X". Setting it unconditionally is
  // exactly how this page ended up defaulting to zero results.
  const applyFilters = (filters) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", filters.searchTerm);
    urlParams.set("order", filters.sort);
    if (filters.category === ALL_CATEGORIES) {
      urlParams.delete("category");
    } else {
      urlParams.set("category", filters.category);
    }
    navigate(`/search?${urlParams.toString()}`);
  };

  // Category/sort apply immediately on change, AutoFilter-style - no
  // separate "Apply" step for these two (REBUILD_PLAN search redesign).
  const handleFilterChange = (id, value) => {
    const next = { ...sidebarData, [id]: value };
    setSidebarData(next);
    applyFilters(next);
  };

  // Handles Enter/search-icon submit for the search term.
  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilters(sidebarData);
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
    <div>
      {/* Toolbar - search + filters in one bar, like Excel's AutoFilter
          row, instead of a sidebar form (REBUILD_PLAN search redesign). */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-6xl flex-col gap-3 p-4 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2">
            <button
              type="submit"
              aria-label="Search"
              className="text-gray-400 hover:text-primaryText dark:hover:text-primary"
            >
              <HiOutlineSearch className="h-4 w-4" />
            </button>
            <input
              id="searchTerm"
              type="text"
              placeholder="Buscar tutoriales, funciones, plantillas..."
              value={sidebarData.searchTerm}
              onChange={handleSearchTermChange}
              className="w-full border-none bg-transparent p-0 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <ToolbarDropdown
              id="category"
              label="Categoría"
              value={sidebarData.category}
              onChange={handleFilterChange}
              options={[
                { value: ALL_CATEGORIES, label: "Todas" },
                ...categories.map((category) => ({
                  value: category,
                  label: category,
                })),
              ]}
            />
            <ToolbarDropdown
              id="sort"
              label="Orden"
              value={sidebarData.sort}
              onChange={handleFilterChange}
              options={[
                { value: "desc", label: "Recientes" },
                { value: "asc", label: "Antiguos" },
              ]}
            />
          </div>
        </form>
      </div>

      {/* Main Content */}
      <div className="w-full">
        <div className="flex items-center justify-between sm:border-b border-secondary p-3 mt-5">
          <h1 className="text-3xl font-semibold">Posts Results</h1>
          <PostViewToggle view={view} onChange={setView} />
        </div>
        <div
          className={`p-7 mx-auto flex flex-col gap-4 ${
            view === "grid" ? "max-w-6xl" : "max-w-3xl"
          }`}
        >
          {/* Display message for no posts */}
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500 dark:text-gray-400 text-center">
              No posts found.
            </p>
          )}
          {/* Loading indicator */}
          {loading && (
            <p className="text-xl text-gray-500 dark:text-gray-400 text-center">
              Loading...
            </p>
          )}
          {/* Post cards - hairline row/grid list, see Home.jsx (REBUILD_PLAN 6b.3/6b.5) */}
          {!loading && posts && posts.length > 0 && (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-gray-200 dark:divide-gray-700 border-t border-l border-gray-200 dark:border-gray-700"
                  : "flex flex-col divide-y divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700"
              }
            >
              {posts.map((post) => (
                <PostCard key={post._id} post={post} variant={view} />
              ))}
            </div>
          )}
          {/* Show More button */}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-secondaryText dark:text-secondary text-lg hover:text-primaryText dark:hover:text-primary p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
