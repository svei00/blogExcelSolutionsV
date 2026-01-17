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
    // Optional - falls back to the post title when empty (PostPage.jsx,
    // injectMeta.js). In-content Markdown images already get alt text
    // naturally via ![alt](url) syntax - this field is only for the
    // single cover image, which isn't Markdown (REBUILD_PLAN 5.6).
    imageAlt: {
      type: String,
      default: "",
    },
    // Null by default - deliberately NOT auto-set from createdAt/updatedAt.
    // svei writes content meant to age slowly (a correct formula doesn't
    // rot the way a trend post does), so a *published* date on a card
    // would measure exactly the thing that's irrelevant here, and
    // updatedAt already can't be trusted for this (6.6: a typo fix bumps
    // a 2024 post above everything newer). This is a manual "I re-checked
    // this still works in current Excel" stamp - unset means exactly
    // that, no card should ever fall back to createdAt/updatedAt when
    // this is null (REBUILD_PLAN 6b.2).
    reviewedAt: {
      type: Date,
      default: null,
    },
    // hreflang support for the ES/EN post pair (REBUILD_PLAN 11.C.1,
    // finding #8). "es" default matches the site's Spanish-first
    // convention elsewhere (e.g. injectMeta's JSON-LD inLanguage).
    // Every OTHER post on the site is Spanish-only and simply never
    // sets translationSlug - lang alone on those posts is inert.
    lang: {
      type: String,
      enum: ["es", "en"],
      default: "es",
    },
    // Slug of this post's translated counterpart, if one exists.
    // Deliberately just a slug string, not a Mongo ref/ObjectId - same
    // "manual editorial field, admin is responsible for keeping it
    // accurate" pattern as reviewedAt above. injectMeta.js looks this
    // post up at request time to read ITS OWN lang (not an assumption)
    // for the reciprocal <link rel="alternate" hreflang> pair - Google
    // ignores hreflang annotations that aren't reciprocal, so a stale/
    // wrong translationSlug just means the tag quietly doesn't appear,
    // never a broken link shown to a user.
    translationSlug: {
      type: String,
      default: "",
    },
    // Legacy primary category - kept for every post (old and new) so
    // every existing single-category reader (breadcrumbs, injectMeta's
    // BreadcrumbList JSON-LD, related-posts-by-category, DashPosts) keeps
    // working unmodified. post.controller.js's resolveCategories() keeps
    // this in sync with categories[0] on every create/update.
    category: {
      type: String,
      default: "uncategorized",
    },
    // Multi-category support. Deliberately NO default here, unlike
    // `category` above - an absent `categories` array is exactly how a
    // post that predates this field is told apart from a genuinely
    // single-category one at read time (post.controller.js's
    // readCategories()). A default would make Mongoose hydrate every
    // legacy document with a fabricated ["uncategorized"], indistinguishable
    // from a real value, and break that fallback.
    categories: {
      type: [String],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    // Every slug this post has EVER lived at (REBUILD_PLAN 11.C.2,
    // finding #7) - several pre-5.7 slugs stripped accents instead of
    // transliterating them (dinmico instead of dinámico), plus a couple
    // with a leading/triple hyphen. Empty on every post by default;
    // only populated by the deliberate one-post-at-a-time migration
    // script (never through the normal admin edit form - `slug` isn't
    // in updatepost's $set whitelist on purpose, a slug is not meant to
    // be an incidentally-editable field). injectMeta.js's /post/:slug
    // handler falls back to this on a canonical-slug miss and 301s to
    // the real slug, so a page that's already ranked/linked at an old
    // damaged URL doesn't just silently break or fork into two live
    // addresses for the same content.
    slugAliases: {
      type: [String],
      default: [],
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
