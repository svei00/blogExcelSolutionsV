// Escapes regex special characters (. * + ? ^ $ { } ( ) | [ ] \) so user
// input passed straight into a Mongo $regex query is treated as a literal
// string, not a pattern. Without this, a crafted searchTerm like
// "(a+)+$" can pin the DB's CPU trying to backtrack a catastrophic
// regex (ReDoS) - see REBUILD_PLAN finding H7.
export default function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
