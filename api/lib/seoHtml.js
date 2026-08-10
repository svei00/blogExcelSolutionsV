import { getMetaDescription } from "../utils/stripToPlainText.util.js";
import { SITE_URL, SITE_NAME, AUTHOR_NAME, AUTHOR_SAME_AS } from "../config/site.js";
import { categoryLabel } from "../config/categories.js";
import renderPostContent from "./renderPostContent.js";

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
// Shared by buildHomeBody and buildArchiveBody (REBUILD_PLAN 11.A.4) -
// both are just "a heading, then this list of posts" with different
// framing around it. One place for the actual post markup so the two
// pages can't quietly diverge in how a post link looks.
function buildPostListItems(posts) {
  return posts
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
}

// Organization + WebSite JSON-LD (REBUILD_PLAN 11.B.3) - homepage-only,
// site-wide identity markup Google can use for a Sitelinks Search Box
// and richer brand results. Valid to place in <body> (Google explicitly
// supports JSON-LD anywhere in the document) - lives here rather than
// index.html's <head> META block so home doesn't need its own META
// override, unlike a post page.
function buildHomeJsonLd() {
  const organization = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  }).replace(/</g, "\\u003c");

  const website = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?searchTerm={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }).replace(/</g, "\\u003c");

  return `<script type="application/ld+json">${organization}</script>
    <script type="application/ld+json">${website}</script>`;
}

// ⚠️ The <h1>/subtitle copy below is hand-synced with Home.jsx's hero
// text, not derived from it (that component isn't reachable from here -
// separate bundle, browser-only APIs). If you change the hero copy in
// Home.jsx, update this string in the same commit or the pre-JS moment
// and the post-hydration moment will say different things.
export function buildHomeBody(posts) {
  const postItems = buildPostListItems(posts);

  return `${SSR_START}
    <div class="bg-white text-gray-700 min-h-screen">
      <div class="max-w-6xl mx-auto px-3 py-16">
        <h1 class="text-3xl font-bold lg:text-5xl">Habilidades de Excel que resuelven problemas reales de trabajo</h1>
        <p class="mt-6 text-gray-500 text-base sm:text-lg max-w-2xl">Tutoriales paso a paso de fórmulas, automatización y análisis de datos, incluidos los flujos de CFDI y SAT para contadores mexicanos. Sin relleno: solo hojas de cálculo que funcionan.</p>
        <nav class="mt-6 flex flex-wrap gap-4 text-sm font-medium text-primaryText">
          <a href="/search">Ver artículos</a>
          <a href="/contact">Solicitar ayuda con Excel</a>
          <a href="/about">Acerca</a>
          <a href="/projects">Proyectos</a>
        </nav>
      </div>
      <div class="max-w-3xl mx-auto px-3 pb-16">
        <h2 class="text-2xl font-semibold mb-2">Publicaciones recientes</h2>
        ${postItems}
      </div>
    </div>
    ${buildHomeJsonLd()}
    ${SSR_END}`;
}

// The full archive (REBUILD_PLAN 11.A.4) - /search already IS the post
// archive and is already in the sitemap, so this is a second free path
// into every article alongside the homepage's latest-12. Only for the
// UNFILTERED view (injectMeta.js's injectArchive only calls this when
// the request has no query params) - a filtered view (?category=X) is a
// different page conceptually and gets noindex treatment instead
// (REBUILD_PLAN 11.B.4), not a server-rendered body.
//
// ⚠️ Scaling trigger, noted but not built: past ~50 posts this needs
// real pagination links (rel=next/prev or numbered pages) or it turns
// into one unpaginated wall of posts. Not a real problem at today's
// count (14) - don't build pagination pre-emptively.
export function buildArchiveBody(posts) {
  return `${SSR_START}
    <div class="bg-white text-gray-700 min-h-screen">
      <div class="max-w-3xl mx-auto px-3 py-10">
        <h1 class="text-3xl font-semibold mb-6">All Posts</h1>
        ${buildPostListItems(posts)}
      </div>
    </div>
    ${SSR_END}`;
}

// Moved unchanged from injectMeta.js (REBUILD_PLAN 11.A.2) - same logic,
// new home. See client/index.html's "THE PLACEHOLDER CONTRACT" comment
// for what this block is and why it exists.
// `translation` (REBUILD_PLAN 11.C.1) is the counterpart post's own
// {lang, slug} - or null when this post has no translationSlug set, or
// it points at a slug that doesn't exist (stale/typo'd reference).
// Passed in already-looked-up rather than queried here, keeping this
// file DB-free (REBUILD_PLAN 11.A.2's whole reason for existing) -
// injectMeta.js owns the lookup.
export function buildPostMetaBlock(post, translation = null) {
  const title = escapeHtml(post.title);
  const description = escapeHtml(getMetaDescription(post));
  const image = escapeHtml(post.image);
  const imageAlt = escapeHtml(post.imageAlt || post.title);
  const url = `${SITE_URL}/post/${post.slug}`;

  // hreflang (REBUILD_PLAN 11.C.1, finding #8) - only emitted for posts
  // that are actually half of a real translated pair. Google requires
  // this to be RECIPROCAL (each page lists both itself and its
  // counterpart) or it ignores the annotation entirely - the self link
  // is not optional decoration, it's part of what makes the pair valid.
  const hreflangLinks = translation
    ? `<link rel="alternate" hreflang="${post.lang}" href="${url}" />
    <link rel="alternate" hreflang="${translation.lang}" href="${SITE_URL}/post/${translation.slug}" />`
    : "";

  // BlogPosting JSON-LD (REBUILD_PLAN 11.B.3 - was a generic "Article"
  // with an "Organization" author, upgraded to the more specific type
  // Google recommends for blog content, with a real named author).
  // `author.sameAs` is the actual E-E-A-T signal: a credentialed
  // 17-year accountant writing about Mexican fiscal topics is a real
  // trust signal, but it was invisible to Google as long as every post
  // was attributed to the site itself rather than a person.
  // JSON.stringify handles its own escaping for the JSON itself; the
  // surrounding <script> tag content is not HTML-parsed the same way
  // attributes are, but the "<" guard below still prevents a title/
  // description containing "</script>" from breaking out of the block.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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
    author: { "@type": "Person", name: AUTHOR_NAME, sameAs: AUTHOR_SAME_AS },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    inLanguage: post.lang || "es",
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
    ${hreflangLinks}
    <script type="application/ld+json">${jsonLd}</script>
    <script type="application/ld+json">${breadcrumbJsonLd}</script>
    ${META_END}`;
}

// Post-page body (REBUILD_PLAN 11.B.1) - unlike buildHomeBody/
// buildArchiveBody, this is deliberately NOT a trimmed crawler-only
// subset. The article text IS the page; rendering anything less than
// the real content would defeat the entire point of Phase 11 (Google's
// fast, non-JS crawl pass has to see the actual tutorial, not a teaser).
// renderPostContent() is the same sanitization pipeline the client
// uses, server-side (see that file's own comment for why it's a
// separate module rather than a shared import).
export function buildPostBody(post, relatedPosts) {
  const contentHtml = renderPostContent(post.content, post.contentFormat, post.title);

  // Mirrors PostPage.jsx's breadcrumb (same skip-uncategorized rule as
  // the JSON-LD BreadcrumbList above, so the visible trail and the
  // structured data never disagree) - kept deliberately simpler than
  // the client's version (no "Recent Articles" fallback heading logic)
  // since this is discarded the instant React mounts.
  const categoryCrumb =
    post.category && post.category !== "uncategorized"
      ? ` &rsaquo; <a href="/search?category=${escapeHtml(post.category)}">${escapeHtml(
          categoryLabel(post.category)
        )}</a>`
      : "";

  const relatedHtml =
    relatedPosts.length > 0
      ? `<nav class="max-w-2xl mx-auto px-3 py-10">
          <h2 class="text-xl font-semibold mb-3">Related Articles</h2>
          ${relatedPosts
            .map(
              (p) =>
                `<a href="/post/${escapeHtml(p.slug)}" class="block py-1">${escapeHtml(
                  p.title
                )}</a>`
            )
            .join("")}
        </nav>`
      : "";

  return `${SSR_START}
    <div class="bg-white text-gray-700 min-h-screen">
      <nav class="max-w-2xl mx-auto px-3 mt-6 text-sm text-gray-500">
        <a href="/">Home</a>${categoryCrumb} &rsaquo; ${escapeHtml(post.title)}
      </nav>
      <h1 class="text-3xl mt-10 p-3 text-center max-w-2xl mx-auto lg:text-4xl">${escapeHtml(
        post.title
      )}</h1>
      <div class="post-content max-w-2xl mx-auto p-3">${contentHtml}</div>
      ${relatedHtml}
    </div>
    ${SSR_END}`;
}
