import fs from "fs";
import path from "path";
import Post from "../models/post.model.js";
import {
  META_START,
  META_END,
  SSR_START,
  SSR_END,
  buildPostMetaBlock,
  buildHomeBody,
  buildArchiveBody,
  buildPostBody,
} from "../lib/seoHtml.js";
import { getCached, setCached } from "../lib/responseCache.js";

// See the big comment blocks in client/index.html (search "THE PLACEHOLDER
// CONTRACT" and "THE SSR-BODY CONTRACT") before changing anything here -
// those two comments and this file are one contract, read together.
// Marker constants and the actual HTML-building logic both live in
// lib/seoHtml.js now (REBUILD_PLAN 11.A.2) - this file only does
// routing/DB access/caching/read-replace-serve.

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
    `injectMeta: ${indexHtmlPath} not found - server-rendered meta/body injection disabled until the client is built.`
  );
}

// Filtered /search (?category=, ?searchTerm=) needs noindex,follow -
// finding #6 in REBUILD_PLAN's Phase 11 audit, a thin faceted page was
// indexed while real articles weren't. ⚠️ Deliberately `noindex,follow`
// ONLY, never combined with a robots.txt `Disallow: /search?` - a
// Disallow would stop Google from crawling the page AT ALL, which means
// it never sees the noindex tag either, and the thin page stays indexed
// forever. This augments index.html's own default META block (title/
// og/etc.) rather than reinventing a copy of it, so those defaults stay
// index.html's single source of truth - if they change, this doesn't
// need touching. Same cached HTML string regardless of which filter is
// active, since the injected content itself never varies by query.
const NOINDEX_TAG = '<meta name="robots" content="noindex,follow" />';
let filteredSearchHtml = null;
if (indexHtmlTemplate) {
  filteredSearchHtml = indexHtmlTemplate.replace(META_START, `${META_START}\n    ${NOINDEX_TAG}`);
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

  // 404s aren't cached (REBUILD_PLAN 11.A.5) - a bad slug is a cheap,
  // rare `findOne` that returns null fast, not worth a cache slot.
  const cacheKey = `post:${req.params.slug}`;
  const cached = getCached(cacheKey);
  if (cached) {
    res.type("html").send(cached);
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

    // Related-by-category, excluding self - same rule PostPage.jsx
    // uses client-side, kept simple here (no "fall back to recent"
    // heading-swap logic - see buildPostBody's comment). Only queried
    // when there's a real category to match; "uncategorized" matching
    // itself would just surface other uncategorized posts, not
    // genuinely related content.
    const relatedPosts =
      post.category && post.category !== "uncategorized"
        ? await Post.find(
            { category: post.category, _id: { $ne: post._id } },
            "title slug"
          )
            .limit(3)
            .lean()
        : [];

    let html = indexHtmlTemplate.replace(
      new RegExp(`${META_START}[\\s\\S]*?${META_END}`),
      buildPostMetaBlock(post)
    );
    html = html.replace(
      new RegExp(`${SSR_START}[\\s\\S]*?${SSR_END}`),
      buildPostBody(post, relatedPosts)
    );
    setCached(cacheKey, html);
    res.type("html").send(html);
  } catch (error) {
    next(error);
  }
}

// Mounted on GET / (REBUILD_PLAN 11.A.3) - same read/replace/serve shape
// as the default export above, different data (latest posts instead of
// one post by slug) and a different marker pair (SSR, not META - the
// homepage's <head> tags are already correct as index.html's site-wide
// defaults; only the body needed real links). Cached (REBUILD_PLAN
// 11.A.5) - "/" moves from "static file, zero Node" to "Express + a
// Mongo query per request" once nginx routes it here, and this is the
// single highest-traffic route on the site. Still no nginx routing for
// "/" yet, though - this handler is deployed and curl-confirmed live on
// purpose, ahead of the nginx change (notes.md 27.1's deploy-order
// rule), so it's inert in production until that lands.
export async function injectHome(req, res, next) {
  if (!indexHtmlTemplate) {
    next();
    return;
  }

  const cached = getCached("home");
  if (cached) {
    res.type("html").send(cached);
    return;
  }

  try {
    const posts = await Post.find(
      {},
      "title slug content contentFormat metaDescription"
    )
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    const html = indexHtmlTemplate.replace(
      new RegExp(`${SSR_START}[\\s\\S]*?${SSR_END}`),
      buildHomeBody(posts)
    );
    setCached("home", html);
    res.type("html").send(html);
  } catch (error) {
    next(error);
  }
}

// Mounted on GET /search (REBUILD_PLAN 11.A.4/11.B.4) - same shape as
// injectHome, cache included. Only injects a real BODY for the
// UNFILTERED archive (no query params) - a filtered view (?category=X,
// ?searchTerm=X) is a different page conceptually: it gets `noindex`
// treatment instead (see filteredSearchHtml above), never a server-
// rendered body (that would mean Google indexing N thin filter pages,
// the exact problem being fixed). Also inert in production until
// 11.A.5's nginx routing lands, same as injectHome.
export async function injectArchive(req, res, next) {
  if (!indexHtmlTemplate) {
    next();
    return;
  }

  if (Object.keys(req.query).length > 0) {
    if (!filteredSearchHtml) {
      next();
      return;
    }
    res.type("html").send(filteredSearchHtml);
    return;
  }

  const cached = getCached("archive");
  if (cached) {
    res.type("html").send(cached);
    return;
  }

  try {
    const posts = await Post.find(
      {},
      "title slug content contentFormat metaDescription"
    )
      .sort({ createdAt: -1 })
      .lean();

    const html = indexHtmlTemplate.replace(
      new RegExp(`${SSR_START}[\\s\\S]*?${SSR_END}`),
      buildArchiveBody(posts)
    );
    setCached("archive", html);
    res.type("html").send(html);
  } catch (error) {
    next(error);
  }
}
