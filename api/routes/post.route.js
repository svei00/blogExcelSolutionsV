import express from "express";
import { verifyToken } from "../utils/verifyUser.util.js";
import validate from "../middleware/validate.js";
import { createPostSchema, updatePostSchema } from "../validators/post.validator.js";
import {
  create,
  getposts,
  deletepost,
  updatepost,
  getCategories,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, validate(createPostSchema), create);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put(
  "/updatepost/:postId/:userId",
  verifyToken,
  validate(updatePostSchema),
  updatepost
);
router.get("/categories", getCategories);

export default router;
