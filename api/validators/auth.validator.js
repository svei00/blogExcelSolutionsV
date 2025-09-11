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
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  googlePhotoUrl: z.string().optional(),
});
