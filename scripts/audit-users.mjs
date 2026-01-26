// READ-ONLY audit script - queries only, never writes/updates/deletes
// anything. Uses the app's real model files (not a re-typed schema) so
// field names can never drift from what's actually deployed. Run from
// the project root (/var/www/blogExcelSolutionsV) - not because the
// imports need it (those resolve relative to this file regardless of
// cwd), but because `dotenv/config` looks for `.env` in the CURRENT
// directory, and that's where the real one lives.
//
// Usage:  node scripts/audit-users.mjs

import "dotenv/config";
import mongoose from "mongoose";
import User from "../api/models/user.model.js";
import Post from "../api/models/post.model.js";
import Comment from "../api/models/comment.model.js";

const KEEP = ["excelsolutionsv", "naturalnoisesoundscapes1051", "carmensandovalvillarreal5556"];
const DELETE_CANDIDATES = ["user1", "user2", "user3", "user4", "user5", "adminTest", "user48"];

function picSource(url) {
  if (!url) return "(none)";
  if (url.includes("lh3.googleusercontent.com")) return "Google OAuth";
  if (url.includes("firebasestorage.googleapis.com")) return "Firebase (manual upload)";
  return `OTHER: ${url}`;
}

function looksHashed(password) {
  // bcrypt hashes are always 60 chars, start with $2a$/$2b$/$2y$.
  return /^\$2[aby]\$\d{2}\$.{53}$/.test(password);
}

async function usageFor(userId) {
  const idStr = String(userId);
  const [postsAuthored, commentsAuthored, postLikes, commentLikes] = await Promise.all([
    Post.countDocuments({ userId: idStr }),
    Comment.countDocuments({ userId: idStr }),
    Post.countDocuments({ "likes.userId": idStr }),
    Comment.countDocuments({ likes: idStr }),
  ]);
  return { postsAuthored, commentsAuthored, postLikes, commentLikes };
}

async function main() {
  await mongoose.connect(process.env.MongoDB);
  console.log("Connected.\n");

  console.log("=== KEEP list - verifying existence + OAuth criterion ===");
  for (const username of KEEP) {
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`❌ ${username}: NOT FOUND - list may be stale, do not assume this is fine`);
      continue;
    }
    const usage = await usageFor(user._id);
    console.log(
      `✅ ${username} | email: ${user.email} | isAdmin: ${user.isAdmin} | pic: ${picSource(user.profilePicture)} | passwordHashed: ${looksHashed(user.password)} | created: ${user.createdAt.toISOString()} | posts:${usage.postsAuthored} comments:${usage.commentsAuthored} postLikes:${usage.postLikes} commentLikes:${usage.commentLikes}`
    );
  }

  console.log("\n=== DELETE candidates - verifying zero usage before anything is touched ===");
  let anyUnsafe = false;
  for (const username of DELETE_CANDIDATES) {
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`⚠️  ${username}: NOT FOUND - already gone, or list is stale. Nothing to delete.`);
      continue;
    }
    const usage = await usageFor(user._id);
    const hasActivity =
      usage.postsAuthored > 0 || usage.commentsAuthored > 0 || usage.postLikes > 0 || usage.commentLikes > 0;
    if (hasActivity) anyUnsafe = true;
    console.log(
      `${hasActivity ? "🛑 HAS ACTIVITY" : "✅ safe to delete"} | ${username} | _id: ${user._id} | email: ${user.email} | isAdmin: ${user.isAdmin} | pic: ${picSource(user.profilePicture)} | passwordHashed: ${looksHashed(user.password)} | created: ${user.createdAt.toISOString()} | posts:${usage.postsAuthored} comments:${usage.commentsAuthored} postLikes:${usage.postLikes} commentLikes:${usage.commentLikes}`
    );
  }

  console.log("\n=== Broader sweep - anything outside the two named lists ===");
  const allUsers = await User.find({}, "username email isAdmin profilePicture password createdAt");
  const named = new Set([...KEEP, ...DELETE_CANDIDATES]);
  const unlisted = allUsers.filter((u) => !named.has(u.username));
  console.log(`Total users in DB: ${allUsers.length} (named list covers ${named.size})`);
  if (unlisted.length > 0) {
    console.log("⚠️  Accounts NOT in either list - the 10-account list may be incomplete:");
    unlisted.forEach((u) =>
      console.log(`   ${u.username} | ${u.email} | isAdmin: ${u.isAdmin} | pic: ${picSource(u.profilePicture)}`)
    );
  } else {
    console.log("None - the two lists account for every user document.");
  }

  const allAdmins = allUsers.filter((u) => u.isAdmin);
  console.log(`\nAll isAdmin:true accounts (${allAdmins.length}):`);
  allAdmins.forEach((u) => console.log(`   ${u.username} | ${u.email}`));

  const unhashed = allUsers.filter((u) => !looksHashed(u.password));
  if (unhashed.length > 0) {
    console.log(`\n⚠️  ${unhashed.length} account(s) with a password field that does NOT look like a bcrypt hash:`);
    unhashed.forEach((u) => console.log(`   ${u.username} | ${u.email}`));
  }

  // Duplicate emails (same person, multiple accounts, or an
  // impersonation attempt) - checked case-insensitively since email
  // addresses are conventionally case-insensitive.
  const byEmail = new Map();
  allUsers.forEach((u) => {
    const key = u.email.toLowerCase();
    byEmail.set(key, [...(byEmail.get(key) || []), u.username]);
  });
  const dupes = [...byEmail.entries()].filter(([, usernames]) => usernames.length > 1);
  if (dupes.length > 0) {
    console.log(`\n⚠️  Duplicate emails across accounts:`);
    dupes.forEach(([email, usernames]) => console.log(`   ${email}: ${usernames.join(", ")}`));
  }

  console.log(anyUnsafe ? "\n🛑 STOP: at least one delete-candidate has real activity - do not delete without reviewing above." : "\n✅ All delete-candidates show zero activity across posts/comments/likes.");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Audit script failed:", err);
  process.exit(1);
});
