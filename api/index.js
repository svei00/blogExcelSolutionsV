import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js"; // Important to add file extension on backend!!
import authRoutes from "./routes/auth.route.js";
import postRouters from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MongoDB)
  .then(() => {
    console.log("Database connection is Stablished.");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve(); // This is for getting the current directory no mather where it is

const app = express();

app.use(express.json({ limit: "500mb" })); // Increase limit as needed
app.use(express.urlencoded({ limit: "500mb", extended: true })); // Increase limit as needed

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

// Test API
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRouters);
app.use("/api/comment", commentRoutes);

// Static pages of the FrontEnd
app.use(express.static(path.join(__dirname, "/client/dist"))); // Use build for React. Use dist for Vite

// Whatever is not defined in the 4 aap.use above will be sent to the index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html")); // Remember in ReactJS use build
});

// Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
