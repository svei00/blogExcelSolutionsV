import { marked } from "marked";
import DOMPurify from "dompurify";

// In-content post images can't get a `loading="lazy"` prop the normal
// React way - this HTML is injected via dangerouslySetInnerHTML, not
// rendered as JSX elements. This hook runs on every sanitize() call
// below (registered once, module scope) and adds it to every <img>
// automatically (REBUILD_PLAN 4.3). Skips small images (badges/icons
// under 100px) - lazy-loading a tiny inline icon has no payoff and can
// cause it to pop in visibly late on a slow connection.
//
// Also falls back missing `alt` to the post title (REBUILD_PLAN 7.5 -
// Lighthouse found 12 images with no `alt` attribute at all on a
// legacy Quill post, predating the Phase 2 Markdown migration and the
// per-image alt text Markdown syntax gives for free). `fallbackAlt`
// is set per-call by renderPostContent() below, right before the
// synchronous sanitize() call reads it - safe because DOMPurify hooks
// have no way to receive per-call arguments directly. Only fires when
// `alt` is entirely ABSENT, never when it's `alt=""` - an explicit
// empty alt is valid, intentional "decorative image" markup and must
// be respected, not overridden.
let fallbackAlt = "";
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName !== "IMG") return;
  if (!node.hasAttribute("alt") && fallbackAlt) {
    node.setAttribute("alt", fallbackAlt);
  }
  const width = parseInt(node.getAttribute("width"), 10);
  if (!Number.isNaN(width) && width < 100) return;
  node.setAttribute("loading", "lazy");
});

// Legacy Quill-editor posts bake inline `color`/`background-color`
// styles straight into the stored HTML (e.g. `style="color: black"`).
// An inline style always wins over the theme's dark-mode text classes,
// so on a dark background that renders as near-black-on-near-black -
// confirmed via a live Lighthouse audit at a 1.18:1 contrast ratio
// (REBUILD_PLAN 7.5). Post text color must always come from the
// theme, never from stored content, so strip it here rather than
// hand-editing every affected legacy post.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (!node.style || node.style.length === 0) return;
  node.style.removeProperty("color");
  node.style.removeProperty("background-color");
  node.style.removeProperty("background");
});

// The ONLY sanitization point client-side. Both branches end in DOMPurify —
// legacy posts are already HTML from Quill, new posts are Markdown from
// Toast UI, but neither is trusted until it passes through here.
// `postTitle` (optional) is the missing-alt fallback used by the IMG hook
// above - pass the post's title so an image with no alt at all reads as
// something to a screen reader instead of its raw filename.
export default function renderPostContent(content, format, postTitle = "") {
  if (!content) return "";

  fallbackAlt = postTitle;
  const html = format === "md" ? marked.parse(content) : content;
  const sanitized = DOMPurify.sanitize(html);
  fallbackAlt = "";

  return sanitized;
}
