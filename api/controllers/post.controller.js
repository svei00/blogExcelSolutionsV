import DOMPurify from "isomorphic-dompurify";
import { errorHandler } from "../utils/error.util.js";
import escapeRegex from "../utils/escapeRegex.util.js";
import Post from "../models/post.model.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please fill all the fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

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
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

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
      posts,
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
