import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    contentFormat: {
      type: String,
      enum: ["html", "md"],
      default: "html",
    },
    // Optional - falls back to the first 160 chars of the post's plain
    // text (HTML tags/Markdown syntax stripped) when empty. Used for
    // the <meta name="description"> and OG description injected by
    // api/middleware/injectMeta.js (REBUILD_PLAN 5.1/5.3).
    metaDescription: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    likes: [
      {
        userId: {
          type: String,
          required: true,
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
