import DOMPurify from "isomorphic-dompurify";
import slugify from "slugify";
import { errorHandler } from "../utils/error.util.js";
import escapeRegex from "../utils/escapeRegex.util.js";
import stripToPlainText, { getMetaDescription } from "../utils/stripToPlainText.util.js";
import Post from "../models/post.model.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please fill all the fields"));
  }
  // Was: strip everything outside [a-zA-Z0-9-], which just DELETES
  // accented characters (dinámico -> dinmico, método -> mtodo - see the
  // real slugs already live from before this fix, e.g.
  // actualizador-dinmico-de-impuestos). slugify TRANSLITERATES instead
  // (á -> a, é -> e, ñ -> n), so future titles get readable slugs.
  // REBUILD_PLAN 5.7 is explicit: never touch old slugs without 301s -
  // this only affects create(), updatepost() never regenerates a slug.
  const slug = slugify(req.body.title, { lower: true, strict: true });

  // Only "html" posts are sanitized here (legacy Quill format). "md"
  // content is Markdown source text, not HTML - it gets sanitized after
  // marked.parse() turns it into HTML, at render time in
  // renderPostContent.js. Sanitizing raw Markdown source here would just
  // mangle characters like `<3` that are plain text, not markup.
  const content =
    req.body.contentFormat === "html"
      ? DOMPurify.sanitize(req.body.content)
      : req.body.content;

  const newPost = new Post({
    ...req.body,
    content,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9; // The see the page in tiles 3 x 3
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          // It allow us to use multiple criteria. escapeRegex prevents a
          // crafted searchTerm from being interpreted as a regex pattern
          // (ReDoS - see REBUILD_PLAN H7).
          {
            title: { $regex: escapeRegex(req.query.searchTerm), $options: "i" },
          }, // "i" stands for that upper case or lower case text doesn't matter
          {
            content: {
              $regex: escapeRegex(req.query.searchTerm),
              $options: "i",
            },
          },
        ],
      }),
    })
      // createdAt, not updatedAt (REBUILD_PLAN M8/6.6): sorting by
      // updatedAt meant fixing a typo in a 2024 post bumped it above
      // everything published since - surprising editorial behavior for
      // Home, Search "Latest", and related-articles alike.
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Full post content is only needed by single-post lookups (PostPage's
    // ?slug= and UpdatePost's ?postId=) - every other caller (Home,
    // Search, related posts, DashPosts, DashboardComp) only ever renders
    // title/image/category, so shipping full content on every list
    // request was pure wasted bandwidth: real posts run 20-47 KB each,
    // so Home alone was downloading ~270 KB of HTML it never rendered
    // (REBUILD_PLAN 6b.1).
    const includeContent = Boolean(req.query.slug || req.query.postId);

    // excerpt/readingMinutes are computed and returned on EVERY post,
    // regardless of includeContent - that's what lets PostPage consume
    // post.readingMinutes instead of computing its own (the two would
    // otherwise be free to disagree), and lets card UIs show reading
    // time without ever fetching full content.
    //
    // .toObject(), NOT .lean() on the query above: .lean() skips
    // Mongoose's default-value hydration entirely, so any OLDER document
    // missing a field added to the schema later (imageAlt, contentFormat,
    // metaDescription, reviewedAt - every post from before 6.11/6b.2)
    // came back as `undefined` instead of its schema default. Caught this
    // live: an existing 2024 post's imageAlt/metaDescription/
    // contentFormat all vanished from the response after a .lean() pass.
    // .toObject() runs on an already-hydrated document, so defaults are
    // already applied - same output shape, correct defaults.
    const enrichedPosts = posts.map((doc) => {
      const post = doc.toObject();
      const words = stripToPlainText(post.content, post.contentFormat)
        .split(/\s+/)
        .filter(Boolean).length;
      const enriched = {
        ...post,
        excerpt: getMetaDescription(post),
        readingMinutes: Math.max(1, Math.round(words / 200)),
      };
      if (!includeContent) delete enriched.content;
      return enriched;
    });

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts: enrichedPosts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post."));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted!!");
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post."));
  }
  // Same reasoning as create(): only sanitize actual HTML. "md" content
  // is Markdown source, sanitized at render time after marked.parse().
  const content =
    req.body.contentFormat === "html"
      ? DOMPurify.sanitize(req.body.content)
      : req.body.content;

  try {
    const updatepost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        // $set: req.body, this is not secure thats whay we use like this:
        $set: {
          title: req.body.title,
          content,
          contentFormat: req.body.contentFormat,
          category: req.body.category,
          image: req.body.image,
          imageAlt: req.body.imageAlt,
          metaDescription: req.body.metaDescription,
          // 5th field added to this whitelist (contentFormat 2.6,
          // metaDescription 5.3, imageAlt 5.6, now reviewedAt 6b.2) -
          // forgetting to add a new post field here is this project's
          // most-repeated bug (notes.md 27.4). $set: req.body is not used
          // deliberately - see the comment above.
          reviewedAt: req.body.reviewedAt || null,
        },
      },
      { new: true }
    );
    res.status(200).json(updatepost);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Post.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    next(errorHandler(500, "Failed to fetch categories"));
  }
};
