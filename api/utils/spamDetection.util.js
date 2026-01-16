import Jwt from "jsonwebtoken";

// Anti-bot heuristics for the contact form (2026-08-30 incident - a
// spam submission with a 24-char random name and 20-char random
// message got through with zero filtering). Every check here is
// designed to fail OPEN, not closed: svei was explicit that he'd
// rather a spam message slip through than a real one get silently
// eaten, so every threshold below is tuned to only fire on the
// genuinely obvious case, and every failure mode defaults to
// "treat as human" rather than "treat as bot".

// ─── Signed submit-timing token ─────────────────────────────────────
// A bot that POSTs directly (skipping the page load / JS timing a real
// browser naturally has) can fake a "time since page load" field, but
// it can't forge a signature for one - so the timestamp has to come
// from a token WE issued and signed, not anything the client reports
// on its own. Reuses JWT_SECRET (already used for session tokens) -
// no new secret to provision. `purpose` in the payload keeps this
// token from being interchangeable with a real session token even
// though they share a secret (verifyFormToken never accepts one
// without it).
const FORM_TOKEN_PURPOSE = "contact-form";
const MIN_SUBMIT_MS = 3000; // no human reads+fills+submits a 3-field form faster than this

export function signFormToken() {
  return Jwt.sign({ purpose: FORM_TOKEN_PURPOSE }, process.env.JWT_SECRET, {
    expiresIn: "2h", // generous - a real visitor who steps away mid-form shouldn't get silently dropped
  });
}

// Returns "bot" | "expired" | "human" - three outcomes, not two,
// because an expired-but-otherwise-valid token (a real visitor who
// took their time) must NOT be treated the same as a forged/missing
// one. Only "bot" should ever lead to a silent discard.
export function checkFormToken(token) {
  if (!token || typeof token !== "string") return "bot";

  try {
    const payload = Jwt.verify(token, process.env.JWT_SECRET);
    if (payload.purpose !== FORM_TOKEN_PURPOSE) return "bot";
    const elapsedMs = Date.now() - payload.iat * 1000;
    return elapsedMs < MIN_SUBMIT_MS ? "bot" : "human";
  } catch (error) {
    // TokenExpiredError specifically means the signature WAS valid -
    // just old. That's a slow real visitor, not a forgery.
    return error.name === "TokenExpiredError" ? "expired" : "bot";
  }
}

// ─── High-entropy content check ─────────────────────────────────────
// Matches the actual spam sample this was built from: 20-30 char
// random mixed-case strings, no spaces, almost no vowels
// ("JQJDvYWqtfEwegFtsHmhNGJs", "YpQmlfZXZgyvJgjoQsUx"). Deliberately
// narrow - length >= 12 AND zero spaces AND vowel ratio under 15% -
// so a short real name ("Ana"), a real name with no vowels in isolation
// but normal length, or any multi-word message never trips it. Spaces
// alone exempt almost every genuine message instantly.
const VOWEL_RE = /[aeiouAEIOU]/g;

export function isHighEntropy(value) {
  if (!value || value.includes(" ") || value.length < 12) return false;
  const vowelCount = (value.match(VOWEL_RE) || []).length;
  return vowelCount / value.length < 0.15;
}

// ─── Email normalization (for dedup, not delivery) ──────────────────
// Only Gmail/Googlemail actually ignore dots in the local part - this
// must NOT strip dots from other providers, where "john.doe@x.com" and
// "johndoe@x.com" are genuinely different mailboxes. "+" suffix
// stripping (plus-addressing) is near-universal and safe to normalize
// for every provider. Returns the normalized form for DEDUP/matching
// only; the original, unmodified email is what gets displayed/replied
// to - see message.controller.js.
export function normalizeEmail(email) {
  const trimmed = email.trim().toLowerCase();
  const [local, domain] = trimmed.split("@");
  if (!domain) return trimmed;

  const noPlus = local.split("+")[0];
  const isGmail = domain === "gmail.com" || domain === "googlemail.com";
  const normalizedLocal = isGmail ? noPlus.replace(/\./g, "") : noPlus;

  return `${normalizedLocal}@${domain}`;
}
