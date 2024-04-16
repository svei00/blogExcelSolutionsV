import express from "express";
import { verifyToken } from "../utils/verifyUser.util.js";
import { create } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getposts);

export default router;