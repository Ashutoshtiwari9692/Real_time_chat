import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    let { userName, email, password } = req.body;
    userName = userName?.trim();
    email = email?.trim().toLowerCase();

    if (!userName || !email || !password) return res.status(400).json({ message: "All fields required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be 6+ chars" });

    const exists = await User.findOne({ $or: [{ email }, { userName }] });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ userName, email, password: hash });

    const token = signToken({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { _id: user._id, userName: user.userName, email: user.email } });
  } catch (e) {
    res.status(500).json({ message: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { _id: user._id, userName: user.userName, email: user.email } });
  } catch (e) {
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
