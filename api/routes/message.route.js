import express from "express";
import { verifyToken } from "../utils/verifyUser.util.js";
import { messageLimiter } from "../middleware/rateLimits.js";
import validate from "../middleware/validate.js";
import { createMessageSchema } from "../validators/message.validator.js";
import {
  createMessage,
  getMessages,
  markMessageRead,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// The only public route here - no verifyToken, this is the contact
// form, submitted by anonymous visitors.
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
