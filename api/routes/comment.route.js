import express from "express";
import { verifyToken } from "../utils/verifyUser.util.js";
import { commentLimiter } from "../middleware/rateLimits.js";
import validate from "../middleware/validate.js";
import {
  createCommentSchema,
  editCommentSchema,
} from "../validators/comment.validator.js";
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  commentLimiter,
  validate(createCommentSchema),
  createComment
);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", verifyToken, likeComment); // We use put since we need to update it sometimes.
router.put(
  "/editComment/:commentId",
  verifyToken,
  validate(editCommentSchema),
  editComment
);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);
router.get("/getcomments", verifyToken, getComments);

export default router;
