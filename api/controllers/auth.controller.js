import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.util.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import verifyFirebaseToken from "../utils/verifyFirebaseToken.util.js";

export const signup = async (req, res, next) => {
  // console.log(req.body); This line was added for testing purpouses.

  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10); // 10 mens the number of salts

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("Signup Successful!!");

    // const user = await User.create({ username, email, password });
    // res.status(201).json({ user: user._id });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      // next(errorHandler(404, "User not found =("));
      return next(errorHandler(400, "Invalid credentials"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid credentials"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  // SECURITY (notes.md 34.1): the email is taken from the VERIFIED
  // token, never from req.body. The previous version trusted a
  // body-supplied email outright, which meant anyone who knew an
  // account's address - the admin's included, readable via the public
  // GET /api/user/:userId - could POST it here and be handed that
  // account's session cookie, isAdmin and all. The request body no
  // longer carries an email at all; there is nothing left to forge.
  let googleUser;
  try {
    googleUser = await verifyFirebaseToken(req.body.idToken);
  } catch (error) {
    // Deliberately opaque and always 401 - never leak whether the token
    // was expired, malformed, for another project, or simply absent.
    console.warn("Rejected Google sign-in:", error.message);
    return next(errorHandler(401, "Google sign-in could not be verified"));
  }

  const { email, name, picture } = googleUser;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      const { password: pass, ...rest } = user._doc; // Substract the password
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        })
        .json(rest);
    } else {
      // Placeholder password for an OAuth-created account: the user never
      // sees or uses it (they always sign in through Google), but it has
      // to be unguessable anyway - /api/auth/signin accepts email+password
      // for ANY account, including these. The previous version built it
      // from Math.random(), which is NOT cryptographically secure and is
      // seeded predictably enough to be reconstructed - that would have
      // let someone derive an OAuth user's password and sign in as them
      // through the normal form. crypto.randomBytes is the correct source.
      const generatePassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        // Same shape as before (name + 4 digits), but the suffix is also
        // crypto-random now rather than Math.random.
        username:
          (name || email.split("@")[0]).toLowerCase().split(" ").join("") +
          crypto.randomInt(1000, 10000),
        email,
        password: hashedPassword,
        profilePicture: picture,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
