import express from "express";
import { verifyToken } from "../utils/verifyUser.util.js";
import {
  create,
  getposts,
  deletepost,
  updatepost,
  getCategories,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);
router.get("/categories", getCategories);

export default router;
