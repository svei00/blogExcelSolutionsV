// Firebase project id. NOT a secret - it's already baked into the
// client bundle (client/src/firebase.js) and visible to anyone who
// views source, same as the Firebase apiKey. Hardcoded rather than
// read from .env on purpose, following the api/config/site.js
// precedent: a missing env var here would silently break Google
// sign-in on deploy, and there's nothing to protect by hiding a value
// that's public by design.
//
// Used to validate the `iss` and `aud` claims of incoming Firebase ID
// tokens (api/utils/verifyFirebaseToken.util.js) - checking those is
// exactly what stops someone replaying a token minted for a DIFFERENT
// Firebase project against this API.
export const FIREBASE_PROJECT_ID = "excelsolutionsv-blog";
