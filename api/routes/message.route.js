import express from "express";
import { verifyToken } from "../utils/verifyUser.util.js";
import { messageLimiter } from "../middleware/rateLimits.js";
import validate from "../middleware/validate.js";
import { createMessageSchema } from "../validators/message.validator.js";
import {
  createMessage,
  getFormToken,
  getMessages,
  markMessageRead,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Both of these are public - no verifyToken, this is the contact form,
// submitted by anonymous visitors. form-token isn't itself rate-limited
// beyond globalLimiter (index.js) - it's a lightweight signed-timestamp
// mint, not a write, so it isn't a spam vector on its own; /create is
// the actual gate.
router.get("/form-token", getFormToken);
router.post(
  "/create",
  messageLimiter,
  validate(createMessageSchema),
  createMessage
);
router.get("/getmessages", verifyToken, getMessages);
router.put("/markread/:messageId", verifyToken, markMessageRead);
router.delete("/deletemessage/:messageId", verifyToken, deleteMessage);

export default router;
