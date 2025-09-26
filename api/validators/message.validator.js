import { z } from "zod";

export const createMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  // Generous cap - the actual message.controller.js sanitizer trims
  // and strips HTML on top of this, same pattern as comments.
  message: z.string().min(1, "Message is required").max(3000),
});
