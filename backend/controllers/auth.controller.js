import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../lib/utils/generateTokens.js";
import bcrypt from "bcryptjs";

const signUp = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ error: "Account with that email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      fullname: fullname,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profilePicture: newUser.profilePicture,
        coverImage: newUser.coverImage,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log(`Error in Signup Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be username or email

    if (!identifier || !password) {
      return res.status(400).json({
        error: "Please provide username/email and password",
      });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPassowrdCorrect = await bcrypt.compare(password, user.password);
    if (!isPassowrdCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    generateTokenAndSetCookie(user._id, res); // setting cookie.
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profilePicture: user.profilePicture,
      coverImage: user.coverImage,
    });
  } catch (error) {
    console.log(`Error in login Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const logout = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // cookie only over HTTPS in prod
      sameSite: "strict",
    };
    res.clearCookie("jwt", options);
    res.status(200).json({ message: "Logged out Successfully" });
  } catch (error) {
    console.log(`Error in logout Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getMe Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export { signUp, login, logout, getMe };
