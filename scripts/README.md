# Operational scripts

One-off tooling for direct database maintenance, run manually on the VPS —
never through the app, never through `deploy.yml`. Tracked in git on
purpose: these used to live untracked in the VPS's working copy, which
means a `git reset --hard origin/main` (what every deploy does) could
silently discard them the moment someone edited or moved them without also
saving a copy elsewhere. Untracked operational tooling ends up in exactly
the same fragile spot the nginx config was in - see `deploy/nginx/README.md`
for that story.

## Running one

Always from the project root, so `dotenv/config` finds the real `.env`:

```bash
cd /var/www/blogExcelSolutionsV
node scripts/<name>.mjs [args]
```

Every script here is **dry-run by default** - it connects, reads, prints
what it would do, and writes nothing until you re-run it with `--confirm`
(or, for `migrate-slug.mjs`, until you supply the confirm flag explicitly -
see its own usage). Read the dry-run output before adding that flag.

They all import the app's real Mongoose models (`../api/models/...`)
instead of re-typing a schema, so a script can never drift out of sync with
what the app actually stores.

## What's here

- **`migrate-slug.mjs`** - fixes one malformed post slug at a time: sets
  the new slug, preserves the old one in `slugAliases` so
  `injectMeta.js`'s `/post/:slug` handler 301s old links to the new
  address instead of 404ing them. Never bulk - one post, verify the
  redirect live, then the next. Used 2026-09-01 to fix the 5 slugs with
  stripped accents/stray hyphens from before the `slugify`-based
  generator (REBUILD_PLAN 5.7); that batch is done, but the script stays
  generic for whatever the next one is.

- **`audit-users.mjs`** - read-only. Reports, for a hardcoded keep-list and
  delete-candidate list, whether each account exists, whether it has any
  real activity (posts/comments/likes), and does a broader sweep for
  anything outside those two lists (other admins, unhashed passwords,
  duplicate emails). Never writes anything - built to answer "is it safe
  to delete these" before `cleanup-incident.mjs` (or a manual deletion)
  touches anything.

- **`cleanup-incident.mjs`** - deletes a specific spam contact message by
  exact email match, and deletes user accounts from a hardcoded
  delete-candidate list - but only the ones that pass the same
  zero-activity check `audit-users.mjs` reports on; anything with real
  activity is skipped and flagged, never deleted. Built for the
  2026-08-30/31 compromise cleanup (notes.md §34/35) - the specific
  email and username lists inside it are from that incident, not
  generic; edit them (or write a new script from this one as a
  template) for a different cleanup.

## What's NOT here

Script *output* - dumps, generated reports, anything a script writes to a
file - is gitignored (see the root `.gitignore`), not the scripts
themselves. The distinction matters: the scripts are the tooling and stay
tracked; a report a script happens to write is a point-in-time artifact,
not something future runs need to see.
