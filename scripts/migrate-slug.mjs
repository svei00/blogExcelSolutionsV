// Deliberate, ONE POST AT A TIME slug migration (REBUILD_PLAN 11.C.2).
// Dry-run by default - nothing is written unless you pass --confirm.
// Never bulk: run this once per post, verify the 301 + the GSC entry
// for that post, THEN move to the next one.
//
// Usage:
//   node scripts/migrate-slug.mjs <current-slug> <new-slug>              (dry run - shows what WOULD happen)
//   node scripts/migrate-slug.mjs <current-slug> <new-slug> --confirm     (actually writes)

import "dotenv/config";
import mongoose from "mongoose";
import Post from "../api/models/post.model.js";

const [, , currentSlug, newSlug, flag] = process.argv;
const confirm = flag === "--confirm";

if (!currentSlug || !newSlug) {
  console.error("Usage: node scripts/migrate-slug.mjs <current-slug> <new-slug> [--confirm]");
  process.exit(1);
}

// Same shape the fixed slugify-based generator (post.controller.js's
// create()) already produces - lowercase, a-z/0-9/hyphen only, no
// leading/trailing/double hyphen. The whole point of this migration is
// fixing malformed slugs; the tool that fixes them must not be able to
// introduce a new malformed one.
const VALID_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

async function main() {
  if (!VALID_SLUG.test(newSlug)) {
    console.error(
      `❌ "${newSlug}" doesn't look like a clean slug (lowercase, a-z/0-9, single hyphens, no leading/trailing hyphen). Not proceeding.`
    );
    process.exit(1);
  }

  await mongoose.connect(process.env.MongoDB);

  const post = await Post.findOne({ slug: currentSlug });
  if (!post) {
    console.error(`❌ No post found with slug "${currentSlug}". Nothing to migrate.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const collision = await Post.findOne({ slug: newSlug });
  if (collision && String(collision._id) !== String(post._id)) {
    console.error(
      `❌ "${newSlug}" is already used by another post ("${collision.title}"). Choose a different new slug.`
    );
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`Post found: "${post.title}"`);
  console.log(`  current slug : ${post.slug}`);
  console.log(`  new slug     : ${newSlug}`);
  console.log(`  existing aliases: ${JSON.stringify(post.slugAliases)}`);
  console.log(
    confirm
      ? "\n--confirm passed - writing now."
      : "\nDRY RUN - nothing written. Re-run with --confirm to actually apply this."
  );

  if (confirm) {
    const updated = await Post.findByIdAndUpdate(
      post._id,
      {
        $set: { slug: newSlug },
        $addToSet: { slugAliases: currentSlug },
      },
      { new: true }
    );
    console.log(`\n✅ Done. slug: ${updated.slug} | slugAliases: ${JSON.stringify(updated.slugAliases)}`);
    console.log(`\nNext: curl -I https://excelsolutionsv.com/post/${currentSlug} - confirm a 301 to /post/${newSlug}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Migration script failed:", err);
  process.exit(1);
});
