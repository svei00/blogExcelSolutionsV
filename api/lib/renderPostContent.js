import { marked } from "marked";
import createDOMPurify from "isomorphic-dompurify";

// Server-side counterpart to client/src/lib/renderPostContent.js -
// deliberately duplicated, not imported (REBUILD_PLAN 11.B.1/11.B.2,
// same reasoning as api/config/site.js: client/ and api/ are
// independent deployable units, and the client file imports the
// browser-only `dompurify` package, which needs a real DOM/window and
// doesn't run under plain Node - isomorphic-dompurify, already a root
// dependency used elsewhere in post.controller.js, is the Node-safe
// equivalent).
//
// `marked` is pinned to the same major/minor range as the client's
// (^18.0.6, both package.json files) on purpose - a version mismatch
// between the two would mean the server-rendered article text and the
// client-rendered one could visibly disagree the moment React mounts
// and replaces it, exactly the divergence risk REBUILD_PLAN 11.0
// flagged for this whole feature.
//
// Deliberately NOT a full port of the client's hooks - only the
// missing-alt fallback is replicated (it changes actual attribute
// content, which matters for crawlers/screen readers reading the raw
// HTML). The client's other two hooks (lazy-loading, stripping legacy
// inline color styles) are purely visual/perf concerns for the
// pre-hydration paint window, and `dark:` classes don't even apply
// during that window (no `.dark` class on <html> yet - ThemeProvider's
// effect hasn't run), so replicating them here would add complexity
// for a difference nobody would ever actually see.
let fallbackAlt = "";
createDOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName !== "IMG") return;
  if (!node.hasAttribute("alt") && fallbackAlt) {
    node.setAttribute("alt", fallbackAlt);
  }
});

export default function renderPostContent(content, format, postTitle = "") {
  if (!content) return "";

  fallbackAlt = postTitle;
  const html = format === "md" ? marked.parse(content) : content;
  const sanitized = createDOMPurify.sanitize(html);
  fallbackAlt = "";

  return sanitized;
}
