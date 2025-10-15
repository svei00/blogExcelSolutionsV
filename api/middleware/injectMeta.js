import fs from "fs";
import path from "path";
import Post from "../models/post.model.js";
import { getMetaDescription } from "../utils/stripToPlainText.util.js";
import { SITE_URL, SITE_NAME } from "../config/site.js";
import { categoryLabel } from "../config/categories.js";


// See the big comment block in client/index.html (search "THE PLACEHOLDER
// CONTRACT") before changing anything here - the two files are one
// contract, read together.
const START_MARKER = "<!--META-START-->";
const END_MARKER = "<!--META-END-->";

// Read once at process startup, not per-request - this file only
// changes at deploy time, and a deploy restarts pm2 anyway (see
// deploy.yml), so an in-memory cache can never go stale while the
// process is running. __dirname here is api/middleware/, so climb to
// api/, then into client/dist/ - matches the path index.js itself uses
// to serve the built frontend.
const indexHtmlPath = path.join(
  path.resolve(),
  "client",
  "dist",
  "index.html"
);

// Guarded, not a plain readFileSync at module scope: running `npm run
// dev` on the API alone (a normal local workflow - client and API are
// often run separately, client via Vite's own dev server) means
// client/dist/index.html may not exist yet. A hard crash here would
// take down the whole API over a route nobody's hitting in that
// workflow. Falls through to whatever the rest of index.js would have
// done anyway (unchanged pre-existing behavior) if the build is missing.
let indexHtmlTemplate = null;
try {
  indexHtmlTemplate = fs.readFileSync(indexHtmlPath, "utf-8");
} catch {
  console.warn(
    `injectMeta: ${indexHtmlPath} not found - /post/:slug meta injection disabled until the client is built.`
  );
}

// Minimal HTML-escaping for values interpolated into attributes/text
// below. Post titles/descriptions are admin-authored today, but this
// is the crawler-facing HTML response - never trust it blindly, same
// principle as every other sanitization point in this app.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildPostMetaBlock(post) {
  const title = escapeHtml(post.title);
  const description = escapeHtml(getMetaDescription(post));
  const image = escapeHtml(post.image);
  const imageAlt = escapeHtml(post.imageAlt || post.title);
  const url = `${SITE_URL}/post/${post.slug}`;

  // Article JSON-LD - the structured-data piece Google uses for rich
  // results (author, publish date). JSON.stringify handles its own
  // escaping for the JSON itself; the surrounding <script> tag content
  // is not HTML-parsed the same way attributes are, but the "<" guard
  // below still prevents a title/description containing "</script>"
  // from breaking out of the block.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: getMetaDescription(post),
    image: post.image,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: SITE_NAME },
  }).replace(/</g, "\\u003c");

  // BreadcrumbList JSON-LD (REBUILD_PLAN 6.4) - rides on the same
  // injection point as the Article JSON-LD above so crawlers get both.
  // Skips the category crumb entirely for "uncategorized" posts rather
  // than showing a crumb that leads to a meaningless filtered search.
  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
  ];
  if (post.category && post.category !== "uncategorized") {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: categoryLabel(post.category),
      item: `${SITE_URL}/search?category=${post.category}`,
    });
  }
  breadcrumbItems.push({
    "@type": "ListItem",
    position: breadcrumbItems.length + 1,
    name: post.title,
    item: url,
  });
  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  }).replace(/</g, "\\u003c");

  return `${START_MARKER}
    <title>${title} | ${SITE_NAME}</title>
    <meta name="description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${imageAlt}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="${url}" />
    <script type="application/ld+json">${jsonLd}</script>
    <script type="application/ld+json">${breadcrumbJsonLd}</script>
    ${END_MARKER}`;
}

// Mounted on GET /post/:slug only (see index.js) - nginx routes that one
// path prefix to Express instead of serving dist/index.html as a static
// file (see the nginx location block in notes.md/DEPLOY.md), specifically
// so this middleware gets a chance to run before the HTML reaches a
// crawler. Every other route keeps being served as a plain static file,
// with the site-wide defaults already baked into index.html - no Express
// round-trip needed for those.
export default async function injectMeta(req, res, next) {
  if (!indexHtmlTemplate) {
    next();
    return;
  }

  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      // Unknown slug: serve the page unmodified (site-wide default meta)
      // and let the client-side React app render its own not-found
      // state - same as it already does today for a bad slug.
      res.status(404).type("html").send(indexHtmlTemplate);
      return;
    }

    const html = indexHtmlTemplate.replace(
      new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`),
      buildPostMetaBlock(post)
    );
    res.type("html").send(html);
  } catch (error) {
    next(error);
  }
}
