import { marked } from "marked";
import DOMPurify from "dompurify";

// The ONLY sanitization point client-side. Both branches end in DOMPurify —
// legacy posts are already HTML from Quill, new posts are Markdown from
// Toast UI, but neither is trusted until it passes through here.
export default function renderPostContent(content, format) {
  if (!content) return "";

  const html = format === "md" ? marked.parse(content) : content;

  return DOMPurify.sanitize(html);
}
