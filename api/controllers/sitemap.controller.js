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

    const staticUrls = staticPages.map(
      (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
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
