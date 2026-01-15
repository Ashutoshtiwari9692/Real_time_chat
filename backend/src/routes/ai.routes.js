import express from "express";
import { auth } from "../middleware/auth.js";
import Message from "../models/Message.js";

const router = express.Router();

// AI stub: later connect OpenAI here
router.post("/reply", auth, async (req, res) => {
  const { conversationId, prompt } = req.body;

  // Dummy reply (replace with real AI)
  const aiText = `AI: I understood "${prompt}". (Connect OpenAI here)`; 

  const aiMsg = await Message.create({
    conversationId,
    sender: req.userId,
    text: aiText,
    role: "ai"
  });

  res.json(aiMsg);
});

export default router;
