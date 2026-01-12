import { useEffect, useState } from "react";

// Shared across every component that needs the category list (Footer,
// Search) - without this, both fetch /api/post/categories independently
// on any page that renders both at once (i.e. /search), showing up as a
// duplicate request in the network panel for data that's identical
// either way (REBUILD_PLAN 11.A.6). A module-level promise cache, not
// component state, so it's shared across separate component instances,
// not just separate renders of the same one.
let categoriesPromise = null;
function fetchCategoriesOnce() {
  if (!categoriesPromise) {
    categoriesPromise = fetch("/api/post/categories")
      .then((res) => res.json())
      .catch((error) => {
        categoriesPromise = null; // let the next mount retry instead of caching a failure forever
        throw error;
      });
  }
  return categoriesPromise;
}

export default function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchCategoriesOnce()
      .then((data) => {
        if (!cancelled) setCategories(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (!cancelled) console.error("Failed to fetch categories:", error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}
