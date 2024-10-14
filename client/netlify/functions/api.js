import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import connectDB from "../../api/config/db.js"; // Adjust this path as needed
import authRoutes from "../../api/routes/auth.routes.js"; // Adjust these paths as needed
import userRoutes from "../../api/routes/user.routes.js";
import postRoutes from "../../api/routes/post.routes.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use("/.netlify/functions/api/auth", authRoutes);
app.use("/.netlify/functions/api/user", userRoutes);
app.use("/.netlify/functions/api/post", postRoutes);

export const handler = serverless(app);
