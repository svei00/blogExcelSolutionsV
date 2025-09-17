# Authoring guide

Heading hierarchy policy (REBUILD_PLAN 5.5), so SEO and accessibility
tools see one consistent structure across every post.

## The rule

- **`h1` is reserved for the post title.** It's rendered once, automatically,
  by `PostPage.jsx` - never add a top-level heading inside the post body
  itself.
- **Start section headings in the editor at `##` (h2).** In the Toast UI
  editor's Markdown mode, that means typing `##`, not `#`. In WYSIWYG mode,
  use the "Heading 2" option, not "Heading 1" - Toast UI's WYSIWYG heading
  picker has both available, and it's easy to grab the wrong one out of
  habit.
- Subsections under that go `###` (h3), and so on - don't skip levels
  (no jumping from `##` straight to `####`).

## Why this matters

- Screen readers navigate a page by its heading outline. Two `h1`s (or a
  heading level skip) makes that outline confusing or broken.
- Google's crawler uses heading structure as a signal for what a page
  is actually about - a post with no real `h2`s reads as flat, undifferentiated
  text to it, even if the content itself has clear sections.
- `PostPage.jsx` already fixed one instance of this (Phase 1, finding M1):
  "Recent Articles" was rendering as an `h1` alongside the real post title.
  It's now `h2`. Don't reintroduce a second `h1` from inside post content.

## Quick self-check before publishing

Open the published post and check the browser's accessibility tree
(or just read the raw content) for: exactly one `h1` (the title, which
you didn't write - it's automatic), and every heading inside the body
starting at `h2` or lower, in order, no skipped levels.
