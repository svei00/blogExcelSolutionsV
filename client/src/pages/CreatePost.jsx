import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PostForm from "../components/PostForm";
import useAuthFetch from "../hooks/useAuthFetch";

const emptyPost = { title: "", category: "", content: "" };

export default function CreatePost() {
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const handleSubmit = async (formData) => {
    try {
      const res = await authFetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError("Something went wrong!!");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <Helmet>
        <title>Create a New Post | Excel SolutionsV Blog</title>
        <meta
          name="description"
          content="Create a new blog post for Excel SolutionsV Blog"
        />
      </Helmet>
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <PostForm
        initialData={emptyPost}
        onSubmit={handleSubmit}
        submitLabel="Publish!!"
        publishError={publishError}
      />
    </div>
  );
}
