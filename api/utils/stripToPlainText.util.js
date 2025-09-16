// Reduces post content (either format) to plain text, for building a
// short meta-description excerpt server-side. This is a heuristic, not
// a real Markdown parser - good enough for a 160-char snippet, not
// meant to produce accurate rendering. Real rendering still only ever
// happens client-side in renderPostContent.js.
export default function stripToPlainText(content, format) {
  if (!content) return "";

  let text = content;

  if (format === "md") {
    text = text
      .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
      .replace(/`[^`]*`/g, " ") // inline code
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images - drop entirely
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links - keep the label
      .replace(/^#{1,6}\s+/gm, "") // headers
      .replace(/[*_~]{1,3}/g, "") // bold/italic/strikethrough markers
      .replace(/^>\s?/gm, "") // blockquotes
      .replace(/^[-*+]\s+/gm, "") // unordered list markers
      .replace(/^\d+\.\s+/gm, ""); // ordered list markers
  }

  return text
    .replace(/<[^>]*>/g, " ") // any HTML tags (legacy "html" posts, or raw HTML embedded in Markdown)
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// A post's metaDescription field wins if the author set one (REBUILD_PLAN
// 5.3); otherwise falls back to the first 160 chars of the plain-text
// content.
export function getMetaDescription(post) {
  if (post.metaDescription) return post.metaDescription.slice(0, 160);
  return stripToPlainText(post.content, post.contentFormat).slice(0, 160);
}
