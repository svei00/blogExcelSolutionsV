import { z } from "zod";

export const createMessageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  // Generous cap - the actual message.controller.js sanitizer trims
  // and strips HTML on top of this, same pattern as comments.
  message: z.string().min(1, "Message is required").max(3000),
  // Both deliberately optional/permissive at the validation layer, not
  // required or format-checked - a bot that omits them or sends
  // garbage must get the exact same response as one that gets them
  // "wrong" (the silent-discard fake-success in message.controller.js),
  // never a distinguishing 400 that would teach it these fields exist.
  website: z.string().max(200).optional().default(""), // honeypot
  formToken: z.string().optional().default(""), // signed submit-timing token
});
