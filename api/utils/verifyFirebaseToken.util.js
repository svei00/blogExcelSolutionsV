import { createRemoteJWKSet, jwtVerify } from "jose";
import { FIREBASE_PROJECT_ID } from "../config/firebase.js";

// Server-side verification of a Firebase ID token (SECURITY AUDIT
// notes.md 34.1). Before this existed, /api/auth/google took an `email`
// straight from the request body and issued a session cookie for
// whatever account matched it - a complete authentication bypass: knowing
// the admin's email address (a public read via GET /api/user/:userId)
// was enough to be handed an admin cookie. This module is what makes the
// caller PROVE Google actually authenticated them.
//
// Deliberately uses `jose` against Google's public JWKS rather than
// `firebase-admin`:
//   - Verifying an ID token needs only public keys plus the project id.
//     firebase-admin would drag in a service-account JSON - a NEW
//     long-lived secret to store on the VPS, back up, and eventually
//     leak. Adding another credential to a codebase we're cleaning up
//     after a credential leak is the wrong direction.
//   - jose is small, has no transitive dependencies, and does the
//     signature/claim checking properly.
//
// Google rotates these signing keys regularly; createRemoteJWKSet
// fetches on demand and caches, refetching when it sees an unknown
// `kid`, so key rotation needs no action here.
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

// Throws on ANY problem - caller treats a throw as "not authenticated"
// and must never fall back to trusting request-body values instead.
export default async function verifyFirebaseToken(idToken) {
  if (!idToken || typeof idToken !== "string") {
    throw new Error("Missing Firebase ID token");
  }

  // jwtVerify checks the signature against Google's live public keys AND
  // the iss/aud/exp/nbf claims. All four matter: a valid signature alone
  // would still accept a token minted for someone else's Firebase
  // project, or an expired one.
  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
    audience: FIREBASE_PROJECT_ID,
  });

  // `sub` is the Firebase uid - always present on a real token.
  if (!payload.sub) {
    throw new Error("Firebase ID token has no subject");
  }
  if (!payload.email) {
    throw new Error("Firebase ID token has no email");
  }
  // Without this check, a provider that hands out unverified addresses
  // would let someone sign in as an account whose email they merely
  // CLAIMED - a quieter version of the exact bypass this file fixes.
  if (payload.email_verified !== true) {
    throw new Error("Firebase ID token email is not verified");
  }

  return {
    uid: payload.sub,
    email: payload.email,
    name: payload.name || "",
    picture: payload.picture || "",
  };
}
