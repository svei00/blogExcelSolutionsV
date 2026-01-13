import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import userRoutes from "./routes/user.route.js"; // Important to add file extension on backend!!
import authRoutes from "./routes/auth.route.js";
import postRouters from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import messageRoutes from "./routes/message.route.js";
import { authLimiter, commentLimiter, globalLimiter } from "./middleware/rateLimits.js";
import injectMeta, { injectHome } from "./middleware/injectMeta.js";
import { getSitemap } from "./controllers/sitemap.controller.js";
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

// nginx sits in front of this app and sets X-Forwarded-For on every
// request - without telling Express to trust that (the app is always
// behind exactly one proxy hop in production: nginx -> this process),
// express-rate-limit can't reliably tell visitors apart by IP and
// throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR on every request. Confirmed
// this was happening in production: pm2 logs mern-blog showed the
// ValidationError repeatedly.
app.set("trust proxy", 1);

// CSP is deliberately NOT set here (helmet.contentSecurityPolicy: false) -
// it needs to allowlist AdSense/GA4/Firebase domains and is easier to
// tune and roll out via nginx's Content-Security-Policy-Report-Only mode
// (REBUILD_PLAN 3.6) than to redeploy the API for every adjustment.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(globalLimiter);
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
app.use("/api/message", messageRoutes);

// Server-side meta injection for social crawlers (REBUILD_PLAN 5.1).
// nginx routes only /post/* here in production - every other route is
// served as a plain static file straight from client/dist, no Node
// round-trip. Mounted before express.static so it wins regardless.
app.get("/post/:slug", injectMeta);

// Dynamic sitemap (REBUILD_PLAN 5.2) - nginx routes /sitemap.xml here
// too, same reasoning as /post/*: this needs live DB data, a static
// file can't do it.
app.get("/sitemap.xml", getSitemap);

// Server-rendered homepage body (REBUILD_PLAN 11.A.3) - same reasoning
// as /post/:slug above, but nginx does NOT route "/" here yet (that's
// 11.A.5, which also adds the 502-fallback nginx needs before "/"
// depending on this process is safe). This route existing already,
// deployed and curl-confirmed live, is the prerequisite for that nginx
// change - reloading nginx first, before this handler exists on the
// running process, would 502 the entire homepage (notes.md 27.1).
app.get("/", injectHome);

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
