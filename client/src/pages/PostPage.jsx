import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection.jsx";
import PostCard from "../components/PostCard.jsx";
import { Helmet } from "react-helmet-async";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  // console.log(post); // To see the result of the query

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
          setPost(data.posts[0]);
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

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  const getMetaDescription = (content) => {
    // Strip HTML tagas and get first 160 characters
    return content.replace(/<[^>]*>?/gm, "").substring(0, 160);
  };

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {post && (
        <Helmet>
          <title>{post.title} | Excel SolutionsV Blog</title>
          <meta name="description" content={getMetaDescription(post.content)} />
          <meta property="og:title" content={post.title} />
          <meta
            property="og:description"
            content={getMetaDescription(post.content)}
          />
          <meta property="og:image" content={post.image} />
          <meta
            property="og:url"
            content={`https://blog.excel-solutionsv.com/post/${post.slug}`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.title} />
          <meta
            name="twitter:description"
            content={getMetaDescription(post.content)}
          />
          <meta name="twitter:image" content={post.image} />
          {/* Google AdSense meta tag  */}
          <meta
            name="google-adsense-account"
            content="ca-pub-5050087617356218"
          />
        </Helmet>
      )}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search/?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>
          {post && "about " + (post.content.length / 1000).toFixed(0)} minutes
          to read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content text-justify [&>img]:mx-auto [&>img]:block" // The  [&>img]:mx-auto [&>img]:block is for center the images
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Articles</h1>
        <div className="flex flex-wrap gap-5 mt-5">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
