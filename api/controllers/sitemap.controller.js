import Post from "../models/post.model.js";
import { SITE_URL } from "../config/site.js";

// Kept in one place, hand-maintained - these are the routes in App.jsx
// that are public and worth a search engine crawling (dashboard/auth/
// create-post/update-post are all Disallow'd in robots.txt already,
// so they're deliberately absent here too).
const staticPages = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/projects", changefreq: "monthly", priority: "0.5" },
  { path: "/search", changefreq: "monthly", priority: "0.3" },
];

// GET /sitemap.xml (REBUILD_PLAN 5.2). Slugs never contain XML special
// characters - post.controller.js's slug generator only ever produces
// [a-zA-Z0-9-] - so no escaping is needed on the way into the <loc>
// tags below.
export const getSitemap = async (req, res, next) => {
  try {
    const posts = await Post.find({}, "slug updatedAt").lean();

    // REBUILD_PLAN 11.B.5 - the 4 static pages have no DB-backed "last
    // changed" timestamp of their own (unlike a post). Rather than fake
    // precision with a hardcoded date that would silently go stale, or
    // emit `lastmod` as the current request time (dishonest - it'd say
    // "just now" on every single crawl regardless of whether anything
    // changed, the exact kind of freshness-that-wasn't-earned this
    // project's `reviewedAt` field was built to avoid - REBUILD_PLAN
    // 6b.2), use the most recently updated post as a proxy: these are
    // all navigational hub pages whose actual content (the post list
    // they link to) really did last change at that moment. Falls back
    // to "now" only in the edge case of zero posts existing at all.
    const mostRecentPostUpdate = posts.reduce(
      (latest, post) => (post.updatedAt > latest ? post.updatedAt : latest),
      posts[0]?.updatedAt ?? new Date()
    );

    const staticUrls = staticPages.map(
      (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${mostRecentPostUpdate.toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    );

    const postUrls = posts.map(
      (post) => `  <url>
    <loc>${SITE_URL}/post/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls].join("\n")}
</urlset>`;

    res.type("application/xml").send(xml);
  } catch (error) {
    next(error);
  }
};
