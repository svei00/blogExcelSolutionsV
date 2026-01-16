import mongoose from "mongoose";

// Contact-form submissions (REBUILD_PLAN 6.3). The services CTA on
// PostPage/Home/Projects (CallToAction.jsx) points here instead of an
// external portfolio link. No email-sending is wired up - svei checks
// these in the dashboard, same as Users/Posts/Comments.
const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    // Gmail-dot/+suffix-normalized form of `email` (see
    // spamDetection.util.js's normalizeEmail) - lets the dashboard spot
    // the same sender hiding behind superficially different addresses
    // (the "seeded dots" evasion technique) without ever touching the
    // original `email`, which stays exactly what was submitted.
    normalizedEmail: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Origin data for abuse investigation (2026-08-30 incident: by the
    // time svei went looking for the sender of a spam message, nginx's
    // own access logs had already rotated past it). Stored here instead
    // of relying on log retention, since Mongo doesn't rotate. `ip` is
    // req.ip post-trust-proxy, i.e. the real client IP from
    // X-Forwarded-For, not nginx's.
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
