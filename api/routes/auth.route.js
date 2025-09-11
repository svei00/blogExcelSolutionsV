import express from "express";
import { signup, signin, google } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimits.js";
import validate from "../middleware/validate.js";
import {
  signupSchema,
  signinSchema,
  googleAuthSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/signin", authLimiter, validate(signinSchema), signin);
router.post("/google", authLimiter, validate(googleAuthSchema), google);

export default router;
