import { z } from "zod";

// Content is capped generously here (2000) - the HARD 500-char cap and
// HTML strip happen in comment.controller.js's sanitizeCommentContent.
// This schema is just "is this even a well-formed request", not the
// place the real limit is enforced.
export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000),
  postId: z.string().min(1, "postId is required"),
  userId: z.string().min(1, "userId is required"),
});

export const editCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000),
});
