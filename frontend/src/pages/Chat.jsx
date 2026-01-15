import React from "react";
import { io } from "socket.io-client";
import { api, setAuthToken } from "../api/axios.js";
import ChatLayout from "../components/ChatLayout.jsx";

const socket = io("http://localhost:5000", { autoConnect: false });

export default function Chat() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  React.useEffect(() => {
    setAuthToken(token);
    socket.connect();
    socket.emit("join", { userId: user._id });
    return () => socket.disconnect();
  }, []);

  return <ChatLayout socket={socket} api={api} me={user} />;
}
