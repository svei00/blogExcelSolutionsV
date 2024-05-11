import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostPage() {
  const { postSlug } = useParams();
  const { loading, setLoading } = useState(true);
  const { error, setError } = useState(false);
  const { post, setPost } = useState(null);
  console.log(post); // To see the result of the query

  useEffect(() => {
    // console.log(postSlug); // Testing purposes
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.post[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  if (loading) return <div>Loading...</div>;

  return <div>PostPage</div>;
}
