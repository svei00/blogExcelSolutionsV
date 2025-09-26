import DOMPurify from "isomorphic-dompurify";
import Message from "../models/message.model.js";
import { errorHandler } from "../utils/error.util.js";

// Same reasoning as comment.controller.js's sanitizeCommentContent -
// this is a PUBLIC, unauthenticated endpoint, so strip HTML entirely
// rather than trusting anything about the input. Hard cap matches
// createMessageSchema's zod max, enforced again here in case this
// function is ever called from somewhere that skipped validation.
function sanitizeMessageField(value, maxLength) {
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }).slice(0, maxLength);
}

export const createMessage = async (req, res, next) => {
  try {
    const name = sanitizeMessageField(req.body.name, 100);
    const email = sanitizeMessageField(req.body.email, 254); // RFC 5321 max email length
    const message = sanitizeMessageField(req.body.message, 3000);

    // zod (createMessageSchema) only checks the RAW input before
    // sanitization - something like "<script>alert(1)</script>" passes
    // that check (length > 0) but DOMPurify strips <script> tags AND
    // their text content, leaving "". Re-check post-sanitization so
    // that case gets a clean 400 instead of Mongoose's raw
    // required-field validation error surfacing as a generic 500.
    if (!name || !email || !message) {
      return next(errorHandler(400, "Please fill out all fields with valid content"));
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ success: true });
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
