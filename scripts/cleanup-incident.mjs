// Incident cleanup, part 2 (REBUILD_PLAN / notes.md §34 aftermath):
//   a) delete the specific spam contact message from the sender svei
//      identified as the likely attacker
//   b) delete the 7 test/junk user accounts, keeping only the 3 real
//      ones - but ONLY deletes a candidate if it genuinely has zero
//      posts/comments/likes, exactly like the account-cleanup verify
//      step from earlier in this incident. A "delete these" instruction
//      doesn't skip the check that they're actually safe to delete.
//
// Dry-run by default - nothing is written unless you pass --confirm.
//
// Usage:
//   node scripts/cleanup-incident.mjs            (dry run - shows what WOULD happen)
//   node scripts/cleanup-incident.mjs --confirm  (actually writes)

import "dotenv/config";
import mongoose from "mongoose";
import User from "../api/models/user.model.js";
import Post from "../api/models/post.model.js";
import Comment from "../api/models/comment.model.js";
import Message from "../api/models/message.model.js";

const confirm = process.argv[2] === "--confirm";

const SPAM_EMAIL = "i.d.u.n.e.m.ub.en25.0@gmail.com";

const KEEP = ["excelsolutionsv", "naturalnoisesoundscapes1051", "carmensandovalvillarreal5556"];
const DELETE_CANDIDATES = ["user1", "user2", "user3", "user4", "user5", "adminTest", "user48"];

async function usageFor(userId) {
  const idStr = String(userId);
  const [postsAuthored, commentsAuthored, postLikes, commentLikes] = await Promise.all([
    Post.countDocuments({ userId: idStr }),
    Comment.countDocuments({ userId: idStr }),
    Post.countDocuments({ "likes.userId": idStr }),
    Comment.countDocuments({ likes: idStr }),
  ]);
  return postsAuthored + commentsAuthored + postLikes + commentLikes === 0;
}

async function main() {
  await mongoose.connect(process.env.MongoDB);
  console.log(confirm ? "--confirm passed - this WILL write.\n" : "DRY RUN - nothing written, re-run with --confirm to apply.\n");

  console.log("=== (a) spam message ===");
  const messages = await Message.find({ email: SPAM_EMAIL });
  if (messages.length === 0) {
    console.log(`No message found with email exactly "${SPAM_EMAIL}". Nothing to delete here.`);
  } else {
    messages.forEach((m) =>
      console.log(`Found: "${m.name}" | ${m.email} | sent ${m.createdAt.toISOString()} | ip: ${m.ip || "(none - predates IP logging)"}`)
    );
    if (confirm) {
      const res = await Message.deleteMany({ email: SPAM_EMAIL });
      console.log(`Deleted ${res.deletedCount} message(s).`);
    }
  }

  console.log("\n=== (b) user cleanup ===");
  let deleted = 0;
  let skipped = 0;
  for (const username of DELETE_CANDIDATES) {
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`⚠️  ${username}: not found (already gone, or never existed) - skipping.`);
      continue;
    }
    const safe = await usageFor(user._id);
    if (!safe) {
      console.log(`🛑 ${username}: HAS real activity (posts/comments/likes) - NOT deleting, needs manual review.`);
      skipped++;
      continue;
    }
    console.log(`✅ ${username}: zero activity, safe to delete.`);
    if (confirm) {
      await User.deleteOne({ _id: user._id });
      deleted++;
    }
  }

  console.log("\n=== final check: who remains ===");
  const remaining = await User.find({}, "username email isAdmin");
  console.log(`Total users now: ${remaining.length}`);
  remaining.forEach((u) => console.log(`   ${u.username} | ${u.email} | isAdmin: ${u.isAdmin}`));
  const unexpected = remaining.filter((u) => !KEEP.includes(u.username));
  if (confirm && unexpected.length > 0) {
    console.log(`\n⚠️  ${unexpected.length} account(s) remain that are NOT in the keep-list - review these:`);
    unexpected.forEach((u) => console.log(`   ${u.username} | ${u.email}`));
  } else if (confirm) {
    console.log("\n✅ Only the 3 intended accounts remain.");
  }

  if (skipped > 0) {
    console.log(`\n🛑 ${skipped} candidate(s) were skipped because they have real activity - see above, review before deciding what to do with them.`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Cleanup script failed:", err);
  process.exit(1);
});
