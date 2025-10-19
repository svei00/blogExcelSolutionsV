import { Button, Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection.jsx";
import PostCard from "../components/PostCard.jsx";
import PostImageLightbox from "../components/PostImageLightbox.jsx";
import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../config/site";
import renderPostContent from "../lib/renderPostContent";
import { categoryLabel } from "../config/categories";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const contentRef = useRef(null);
  const [relatedPosts, setRelatedPosts] = useState(null);
  const [relatedHeading, setRelatedHeading] = useState("Related Articles");
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

  // Related, not recent: an accountant reading a CFDI post wants more CFDI
  // content, not whatever was edited most recently. Falls back to recent
  // posts when the current post has no real category or is the only post
  // in its category, so the section is never empty.
  useEffect(() => {
    if (!post) return;
    const fetchRelated = async () => {
      try {
        if (post.category && post.category !== "uncategorized") {
          const res = await fetch(
            `/api/post/getposts?category=${post.category}&limit=4`
          );
          const data = await res.json();
          if (res.ok) {
            const filtered = data.posts
              .filter((p) => p._id !== post._id)
              .slice(0, 3);
            if (filtered.length > 0) {
              setRelatedPosts(filtered);
              setRelatedHeading("Related Articles");
              return;
            }
          }
        }
        const res = await fetch(`/api/post/getposts?limit=4`);
        const data = await res.json();
        if (res.ok) {
          setRelatedPosts(data.posts.filter((p) => p._id !== post._id).slice(0, 3));
          setRelatedHeading("Recent Articles");
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRelated();
  }, [post]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  // post.metaDescription (REBUILD_PLAN 5.3) wins if the author set one;
  // otherwise strip the content down to plain text and take the first
  // 160 chars. Mirrors api/utils/stripToPlainText.util.js's heuristic
  // (duplicated deliberately, not imported - same reasoning as
  // api/config/site.js: client and server are independent bundles).
  const getMetaDescription = (post) => {
    if (post.metaDescription) return post.metaDescription.slice(0, 160);

    let text = post.content;
    if (post.contentFormat === "md") {
      text = text
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`]*`/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/[*_~]{1,3}/g, "")
        .replace(/^>\s?/gm, "")
        .replace(/^[-*+]\s+/gm, "")
        .replace(/^\d+\.\s+/gm, "");
    }
    return text
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);
  };

  const renderedContent = post
    ? renderPostContent(post.content, post.contentFormat)
    : "";

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {post && (
        <Helmet>
          <title>{post.title} | Excel SolutionsV Blog</title>
          <meta name="description" content={getMetaDescription(post)} />
          <meta property="og:title" content={post.title} />
          <meta
            property="og:description"
            content={getMetaDescription(post)}
          />
          <meta property="og:image" content={post.image} />
          <meta
            property="og:url"
            content={`${SITE_URL}/post/${post.slug}`}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.title} />
          <meta
            name="twitter:description"
            content={getMetaDescription(post)}
          />
          <meta name="twitter:image" content={post.image} />
          {/* Without this, SPA navigation between posts (client-side
              routing, no full page reload) would leave whatever canonical
              URL the server injected for the FIRST post loaded stale on
              every post visited after it - injectMeta.js only runs once,
              on the initial HTML response. */}
          <link rel="canonical" href={`${SITE_URL}/post/${post.slug}`} />
        </Helmet>
      )}
      {post && (
        // Server-side counterpart (BreadcrumbList JSON-LD) lives in
        // api/middleware/injectMeta.js (6.1's Categories dropdown feeds
        // both). Category crumb is skipped for "uncategorized" posts -
        // matches the server-side JSON-LD so the visible trail and the
        // structured data never disagree.
        <nav
          aria-label="Breadcrumb"
          className="max-w-2xl mx-auto w-full px-3 mt-6 text-sm text-gray-500 dark:text-gray-400"
        >
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            {post.category && post.category !== "uncategorized" && (
              <>
                <li aria-hidden="true">&rsaquo;</li>
                <li>
                  <Link
                    to={`/search?category=${post.category}`}
                    className="hover:text-primary"
                  >
                    {categoryLabel(post.category)}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">&rsaquo;</li>
            <li aria-current="page" className="truncate max-w-xs">
              {post.title}
            </li>
          </ol>
        </nav>
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
        alt={post && (post.imageAlt || post.title)}
        // aspect-video reserves layout space at a fixed ratio before the
        // image loads - max-h alone is a cap, not a reservation, so the
        // page used to jump as each cover image finished loading (CLS).
        className="mt-10 p-3 aspect-video max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>{post && "about " + post.readingMinutes} minutes to read</span>
      </div>
      <div
        ref={contentRef}
        className="p-3 max-w-2xl mx-auto w-full post-content text-justify [&>img]:mx-auto [&>img]:block" // The  [&>img]:mx-auto [&>img]:block is for center the images
        dangerouslySetInnerHTML={{
          __html: renderedContent,
        }}
      ></div>
      {post && <PostImageLightbox containerRef={contentRef} slug={post.slug} />}
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h2 className="text-xl mt-5">{relatedHeading}</h2>
        <div className="flex flex-wrap gap-5 mt-5">
          {relatedPosts &&
            relatedPosts.map((p) => <PostCard key={p._id} post={p} />)}
        </div>
      </div>
    </main>
  );
}
