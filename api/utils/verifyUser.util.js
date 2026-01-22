import Jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "./error.util.js";

// SECURITY (notes.md 34.6): the signed token carries an `isAdmin` claim
// captured when it was issued, and this used to trust that claim for the
// token's whole 7-day life. That meant demoting an admin, or deleting an
// account outright, did NOT revoke anything - the holder stayed admin
// until their token happened to expire. Directly relevant to the
// 2026-08-30 cleanup: removing rogue admin accounts from the `users`
// collection would not have logged out anyone already holding a token
// for them.
//
// Now the token is only proof of WHO you are; WHAT you may do is re-read
// from the database on every request, so a demotion or deletion takes
// effect on the very next call.
//
// Cost: one extra indexed findById per authenticated request. That is a
// real cost and it is accepted deliberately - authenticated traffic here
// is the admin dashboard plus commenting, not the public read paths
// (those pages are served by the response cache and never reach this).
// Correct authorization is worth more than a saved lookup at this scale.
export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  let payload;
  try {
    payload = Jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // Covers expired, tampered, and wrong-secret tokens alike -
    // deliberately one indistinguishable response for all of them.
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    // `select` keeps this to the one field authorization actually needs;
    // no reason to pull the password hash into memory on every request.
    const user = await User.findById(payload.id).select("isAdmin");

    // No user => the account was deleted (or the id is bogus) while a
    // valid-looking token is still in circulation. That token must stop
    // working immediately, which is exactly the gap this fixes.
    if (!user) {
      return next(errorHandler(401, "Unauthorized"));
    }

    // Shape is unchanged for every caller (`req.user.id`,
    // `req.user.isAdmin` - verified those are the only two fields the
    // API reads), but isAdmin is now the CURRENT value, not the value
    // frozen into the token.
    req.user = { id: String(user._id), isAdmin: user.isAdmin };
    next();
  } catch (error) {
    next(error);
  }
};
