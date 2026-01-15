// In-process TTL cache for the server-rendered HTML responses
// (REBUILD_PLAN 11.A.5). "/" and "/search" move from "static file, zero
// Node" to "Express + a Mongo query per request" once nginx routes them
// here - this removes essentially all of that added load for the common
// case (most requests hit within the TTL window of some earlier one).
//
// No invalidation hooks into post.controller.js, on purpose: a stale
// entry just expires on its own within TTL_MS, and at 60s an editor
// sees their change before they could plausibly alt-tab back to check -
// zero coupling between "someone edited a post" and "the cache noticed"
// is worth more here than instant freshness.
//
// Module-level Map, not a shared store - fine for this app's single pm2
// instance. Would need something like Redis only if this ever ran
// multiple instances behind a load balancer, which it doesn't.
const TTL_MS = 60 * 1000;
const cache = new Map();

export function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.html;
}

export function setCached(key, html) {
  cache.set(key, { html, expires: Date.now() + TTL_MS });
}
