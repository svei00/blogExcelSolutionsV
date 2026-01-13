import { getMetaDescription } from "../utils/stripToPlainText.util.js";
import { SITE_URL, SITE_NAME } from "../config/site.js";
import { categoryLabel } from "../config/categories.js";

// Pure (data) -> HTML string builders for the server-rendered shell - no
// Express, no DB, no fs. injectMeta.js owns routing/DB access/caching/
// reading index.html from disk; this file only turns data already in
// hand into markup, so it's testable in isolation from the request/
// response cycle (REBUILD_PLAN 11.A.2/11.0). Marker constants live here
// too, not in injectMeta.js - the builders below embed them in their
// return values, and injectMeta.js's regex-replace needs the exact same
// strings, so one file owning both means they can never drift apart.

export const META_START = "<!--META-START-->";
export const META_END = "<!--META-END-->";
export const SSR_START = "<!--SSR-START-->";
export const SSR_END = "<!--SSR-END-->";

// Minimal HTML-escaping for values interpolated into attributes/text
// below. Post titles/descriptions are admin-authored today, but this is
// the crawler-facing HTML response - never trust it blindly, same
// principle as every other sanitization point in this app.
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Homepage body - the single biggest lever in the SEO audit (REBUILD_PLAN
// 11.A.3): raw HTML of "/" had ZERO <a href="/post/...">, so a crawler
// that doesn't run JS (and Googlebot's own fast first pass) had no path
// into the blog at all. This closes that gap.
//
// Deliberately NOT a port of Home.jsx/PostCard's full logic (multi-
// category tags, view toggle, featured-post hero image, reading time) -
// per REBUILD_PLAN 11.0's divergence risk, this is a crawler-oriented
// SUBSET: links, headings, and text a search engine benefits from, not a
// visual recreation of the UI. It's discarded the instant React mounts
// (createRoot() replaces #root's children - REBUILD_PLAN 11.A.1 spike),
// so it never has to be pixel-perfect, only present.
//
// ⚠️ The <h1>/subtitle copy below is hand-synced with Home.jsx's hero
// text, not derived from it (that component isn't reachable from here -
// separate bundle, browser-only APIs). If you change the hero copy in
// Home.jsx, update this string in the same commit or the pre-JS moment
// and the post-hydration moment will say different things.
export function buildHomeBody(posts) {
  const postItems = posts
    .map(
      (post) => `
      <article class="border-t border-gray-200 py-4">
        <a href="/post/${escapeHtml(post.slug)}" class="block group">
          <h2 class="text-base font-medium leading-snug group-hover:text-primaryText">${escapeHtml(
            post.title
          )}</h2>
        </a>
        <p class="mt-1 text-sm text-gray-500">${escapeHtml(getMetaDescription(post))}</p>
      </article>`
    )
    .join("");

  return `${SSR_START}
    <div class="bg-white text-gray-700 min-h-screen">
      <div class="max-w-6xl mx-auto px-3 py-16">
        <h1 class="text-3xl font-bold lg:text-5xl">Excel Skills That Solve Real Work Problems</h1>
        <p class="mt-6 text-gray-500 text-base sm:text-lg max-w-2xl">Step-by-step tutorials on formulas, automation, and data analysis — including CFDI and SAT workflows for Mexican accountants. No fluff, just spreadsheets that work.</p>
        <nav class="mt-6 flex flex-wrap gap-4 text-sm font-medium text-primaryText">
          <a href="/search">Browse Articles</a>
          <a href="/contact">Get Excel Help</a>
          <a href="/about">About</a>
          <a href="/projects">Projects</a>
        </nav>
      </div>
      <div class="max-w-3xl mx-auto px-3 pb-16">
        <h2 class="text-2xl font-semibold mb-2">Recent Posts</h2>
        ${postItems}
      </div>
    </div>
    ${SSR_END}`;
}

// Moved unchanged from injectMeta.js (REBUILD_PLAN 11.A.2) - same logic,
// new home. See client/index.html's "THE PLACEHOLDER CONTRACT" comment
// for what this block is and why it exists.
export function buildPostMetaBlock(post) {
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
    // NOT post.updatedAt - that flips on ANY save, including a typo fix,
    // which would tell Google the article was substantively revised.
    // reviewedAt is the deliberate "still verified accurate" stamp
    // (REBUILD_PLAN 6b.2); falls back to createdAt (not updatedAt) when
    // unset, so an unreviewed post never claims a freshness it hasn't
    // earned.
    dateModified: post.reviewedAt || post.createdAt,
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

  return `${META_START}
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
    ${META_END}`;
}
