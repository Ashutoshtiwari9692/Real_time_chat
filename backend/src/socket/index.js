export function setupSocket(io) {
  const online = new Map(); // userId -> socketId

  io.on("connection", (socket) => {
    socket.on("join", ({ userId }) => {
      if (!userId) return;
      online.set(userId, socket.id);
      io.emit("online_users", Array.from(online.keys()));
    });

    socket.on("send_message", ({ toUserId, message }) => {
      const toSocket = online.get(toUserId);
      if (toSocket) {
        io.to(toSocket).emit("receive_message", message);
      }
    });

    socket.on("disconnect", () => {
      for (const [uid, sid] of online.entries()) {
        if (sid === socket.id) online.delete(uid);
      }
      io.emit("online_users", Array.from(online.keys()));
    });
  });
}
