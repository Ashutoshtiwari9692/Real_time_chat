import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "../config/db.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { setupSocket } from "./socket/index.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => res.json({ ok: true, name: "ChatPulse AI API" }));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });
setupSocket(io);

const PORT = process.env.PORT || 8000;

async function start() {
  await connectDB(process.env.MONGODB_URI);
  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
