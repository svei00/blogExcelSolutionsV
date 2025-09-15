import { marked } from "marked";
import DOMPurify from "dompurify";

// In-content post images can't get a `loading="lazy"` prop the normal
// React way - this HTML is injected via dangerouslySetInnerHTML, not
// rendered as JSX elements. This hook runs on every sanitize() call
// below (registered once, module scope) and adds it to every <img>
// automatically (REBUILD_PLAN 4.3). Skips small images (badges/icons
// under 100px) - lazy-loading a tiny inline icon has no payoff and can
// cause it to pop in visibly late on a slow connection.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName !== "IMG") return;
  const width = parseInt(node.getAttribute("width"), 10);
  if (!Number.isNaN(width) && width < 100) return;
  node.setAttribute("loading", "lazy");
});

// The ONLY sanitization point client-side. Both branches end in DOMPurify —
// legacy posts are already HTML from Quill, new posts are Markdown from
// Toast UI, but neither is trusted until it passes through here.
export default function renderPostContent(content, format) {
  if (!content) return "";

  const html = format === "md" ? marked.parse(content) : content;

  return DOMPurify.sanitize(html);
}
