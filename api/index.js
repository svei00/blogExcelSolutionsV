import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js"; // Important to add file extension on backend!!

dotenv.config();

mongoose
  .connect(process.env.MongoDB)
  .then(() => {
    console.log("Database conection is Stablished.");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

// Test API
app.use("/api/user", userRoutes);
