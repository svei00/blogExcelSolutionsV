import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import TurndownService from "turndown";
import PostForm from "../components/PostForm";
import useAuthFetch from "../hooks/useAuthFetch";

const turndownService = new TurndownService();

export default function UpdatePost() {
  const [initialData, setInitialData] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setPublishError(null);
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch post");
        }
        const post = data.posts[0];
        // The editor is markdown-only (REBUILD_PLAN 2.4). Legacy posts
        // (contentFormat "html", written with the old Quill editor) would
        // otherwise show up as raw HTML tags as literal text in the new
        // editor. Converting once, right here at edit-time, is the
        // per-post approach 2.6 called for — no batch migration script.
        // From this point on the post is "md": PostForm always saves
        // contentFormat "md" once the editor has content, and the server
        // now persists that field on update (post.controller.js).
        const content =
          post.contentFormat === "html"
            ? turndownService.turndown(post.content)
            : post.content;
        setInitialData({
          title: post.title,
          category: post.category,
          image: post.image,
          content,
          contentFormat: "md",
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        setPublishError(error.message);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (formData) => {
    try {
      const res = await authFetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      console.error("Error updating post:", error);
      setPublishError("Something went wrong!!");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <Helmet>
        <title>
          {initialData?.title ? `Update: ${initialData.title}` : "Update Post"} |
          Excel SolutionsV Blog
        </title>
        <meta
          name="description"
          content={`Update blog post: ${initialData?.title || ""}`}
        />
      </Helmet>
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      {!initialData ? (
        <div className="flex justify-center items-center">
          <Spinner size="xl" />
          <p>Loading post data... Please wait.</p>
        </div>
      ) : (
        <PostForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel="Update!!"
          publishError={publishError}
        />
      )}
    </div>
  );
}
