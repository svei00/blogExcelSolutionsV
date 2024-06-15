import { TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  console.log(sidebarData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
  }, location.search);

  return (
    <div>
      <div className="">
        <form>
          <div className="">
            <label>Search Term: </label>
            <TextInput placeholder="Search..." id="searchTerm" type="text" />
          </div>
        </form>
      </div>
    </div>
  );
}
