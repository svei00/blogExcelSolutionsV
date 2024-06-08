import express from "express";
import { verifyToken } from "../utils/verifyUser.util.js";
import {
  createComment,
  getPostComments,
} from "../controllers/comment.controller.js";
import {
  likeComment,
  editComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", verifyToken, likeComment); // We use put since we need to update it sometimes.
router.put("/editComment/:commentId", verifyToken, editComment);
router.put("/deleteComment/:commentId", verifyToken, editComment);

export default router;
