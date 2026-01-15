import express from "express";
import { auth } from "../middleware/auth.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const router = express.Router();

// get all users (simple)
router.get("/users", auth, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.userId } }).select("_id userName email");
  res.json(users);
});

// create or get conversation between two users
router.post("/conversation", auth, async (req, res) => {
  const { otherUserId } = req.body;
  if (!otherUserId) return res.status(400).json({ message: "otherUserId required" });

  let convo = await Conversation.findOne({ members: { $all: [req.userId, otherUserId] } });
  if (!convo) convo = await Conversation.create({ members: [req.userId, otherUserId] });

  res.json(convo);
});

// get messages by conversation
router.get("/messages/:conversationId", auth, async (req, res) => {
  const { conversationId } = req.params;
  const msgs = await Message.find({ conversationId }).sort({ createdAt: 1 });
  res.json(msgs);
});

// send message (also stored in DB)
router.post("/messages", auth, async (req, res) => {
  const { conversationId, text } = req.body;
  const msg = await Message.create({ conversationId, sender: req.userId, text, role: "user" });
  res.json(msg);
});

export default router;
