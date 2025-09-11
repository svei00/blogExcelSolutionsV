import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
  image: z.string().optional(),
  contentFormat: z.enum(["html", "md"]).optional(),
});

// Update allows partial edits (a client might only change the title),
// so nothing here is required - but whatever IS sent must be the right
// shape.
export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().optional(),
  image: z.string().optional(),
  contentFormat: z.enum(["html", "md"]).optional(),
});
