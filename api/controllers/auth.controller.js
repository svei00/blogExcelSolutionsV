import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
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
    return res.status(400).json({ message: "All fields are required" });
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
    res.status(500).json({ message: error.message });
  }
};
