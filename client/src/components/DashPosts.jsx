import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  console.log(userPosts); // For testing purposes.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]);

  return <div>DashPosts</div>;
}
