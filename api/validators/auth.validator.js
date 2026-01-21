import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const googleAuthSchema = z.object({
  // ONLY the Firebase ID token (SECURITY - notes.md 34.1). email/name/
  // googlePhotoUrl are deliberately absent: z.object() STRIPS keys it
  // doesn't list, so even if a client (or an attacker) still sends
  // them, they are discarded here and can never reach the controller.
  // Every one of those values now comes from the verified token instead.
  idToken: z.string().min(1, "Google ID token is required"),
});
