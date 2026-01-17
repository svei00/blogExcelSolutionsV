import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
  // z.object() silently STRIPS any key not listed here (see the
  // reviewedAt comment above/below) - forgetting this line would make
  // multi-category selections vanish before they ever reach the
  // controller, with no error anywhere.
  categories: z.array(z.string()).optional(),
  image: z.string().optional(),
  contentFormat: z.enum(["html", "md"]).optional(),
  metaDescription: z.string().max(160).optional(),
  imageAlt: z.string().optional(),
  // Nullable, not just optional - PostForm sends an explicit `null` when
  // the reviewer clears the date input, and z.object() silently STRIPS
  // any key not listed here (caught live: reviewedAt round-tripped as
  // null on every update until this was added, even though
  // post.controller.js's $set whitelist already had it - REBUILD_PLAN 6b.2).
  reviewedAt: z.string().nullable().optional(),
  lang: z.enum(["es", "en"]).optional(),
  translationSlug: z.string().optional(),
});

// Update allows partial edits (a client might only change the title),
// so nothing here is required - but whatever IS sent must be the right
// shape.
export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().optional(),
  // z.object() silently STRIPS any key not listed here (see the
  // reviewedAt comment above/below) - forgetting this line would make
  // multi-category selections vanish before they ever reach the
  // controller, with no error anywhere.
  categories: z.array(z.string()).optional(),
  image: z.string().optional(),
  contentFormat: z.enum(["html", "md"]).optional(),
  metaDescription: z.string().max(160).optional(),
  imageAlt: z.string().optional(),
  reviewedAt: z.string().nullable().optional(),
  lang: z.enum(["es", "en"]).optional(),
  translationSlug: z.string().optional(),
});
