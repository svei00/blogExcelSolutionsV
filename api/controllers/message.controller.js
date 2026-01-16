import DOMPurify from "isomorphic-dompurify";
import Message from "../models/message.model.js";
import { errorHandler } from "../utils/error.util.js";
import { notifyNewLead } from "../utils/notifyLead.util.js";
import {
  signFormToken,
  checkFormToken,
  isHighEntropy,
  normalizeEmail,
} from "../utils/spamDetection.util.js";

// Same reasoning as comment.controller.js's sanitizeCommentContent -
// this is a PUBLIC, unauthenticated endpoint, so strip HTML entirely
// rather than trusting anything about the input. Hard cap matches
// createMessageSchema's zod max, enforced again here in case this
// function is ever called from somewhere that skipped validation.
function sanitizeMessageField(value, maxLength) {
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }).slice(0, maxLength);
}

// Public, unauthenticated - GET so it costs the client nothing but a
// round-trip on page load, and issues a fresh signed token every call
// so a stale tab doesn't paper over the timing check forever.
export const getFormToken = (req, res) => {
  res.status(200).json({ token: signFormToken() });
};

export const createMessage = async (req, res, next) => {
  try {
    const name = sanitizeMessageField(req.body.name, 100);
    const email = sanitizeMessageField(req.body.email, 254); // RFC 5321 max email length
    const message = sanitizeMessageField(req.body.message, 3000);
    const { website, formToken } = req.body;

    // zod (createMessageSchema) only checks the RAW input before
    // sanitization - something like "<script>alert(1)</script>" passes
    // that check (length > 0) but DOMPurify strips <script> tags AND
    // their text content, leaving "". Re-check post-sanitization so
    // that case gets a clean 400 instead of Mongoose's raw
    // required-field validation error surfacing as a generic 500. This
    // stays a REAL error (unlike the bot checks below) - a genuine
    // visitor whose input got stripped down to nothing needs to know,
    // not get a fake "sent" confirmation.
    if (!name || !email || !message) {
      return next(errorHandler(400, "Please fill out all fields with valid content"));
    }

    // Bot signals (2026-08-30 hardening, after an unfiltered spam
    // submission). Every one of these fails OPEN: `tokenResult ===
    // "expired"` is explicitly NOT treated as bot-like (see
    // checkFormToken's comment - a slow real visitor must not get
    // silently dropped), and isHighEntropy's thresholds are tuned to
    // only catch the actual spam pattern, not real short names/messages.
    // On any hit: respond exactly as if the message was sent (201,
    // same shape) but never persist or notify - a bot that gets a
    // distinguishing response (a 400, a different body) learns which
    // defense caught it and adapts; one that gets an identical "success"
    // learns nothing.
    const tokenResult = checkFormToken(formToken);
    const isBot =
      website.length > 0 || tokenResult === "bot" || isHighEntropy(name) || isHighEntropy(message);

    if (isBot) {
      return res.status(201).json({ success: true });
    }

    const newMessage = new Message({
      name,
      email,
      normalizedEmail: normalizeEmail(email),
      message,
      ip: req.ip,
      userAgent: req.get("user-agent") || "",
    });
    await newMessage.save();
    res.status(201).json({ success: true });
    notifyNewLead({ name, email, message }); // fire-and-forget, never blocks the response
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see messages"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    const totalMessages = await Message.countDocuments();
    const totalUnread = await Message.countDocuments({ isRead: false });
    res.status(200).json({ messages, totalMessages, totalUnread });
  } catch (error) {
    next(error);
  }
};

export const markMessageRead = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to update messages"));
  }
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { isRead: true },
      { new: true }
    );
    if (!message) {
      return next(errorHandler(404, "Message not found"));
    }
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete messages"));
  }
  try {
    await Message.findByIdAndDelete(req.params.messageId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
