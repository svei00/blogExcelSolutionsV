import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  signout,
  getUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.util.js";
import { getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getUsers);
router.get(":userId", getUser); // get user by id

export default router;
