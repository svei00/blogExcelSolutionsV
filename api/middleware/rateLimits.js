import rateLimit from "express-rate-limit";

// All rate limits live in this one file so the numbers are easy to find
// and tune together, instead of scattered across route files.
// REBUILD_PLAN H6: /api/auth/signin was brute-forceable, comments could
// be spammed, and there was no cap anywhere.

// Strict: login/signup are the highest-value target for brute force.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, statusCode: 429, message: "Too many attempts, please try again later." },
});

// Moderate: comment creation shouldn't be scriptable into a spam flood.
export const commentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, statusCode: 429, message: "Too many comments, please slow down." },
});

// Light: a floor for every other route, so nothing is completely
// unbounded even if a specific limiter is forgotten on a new route.
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
