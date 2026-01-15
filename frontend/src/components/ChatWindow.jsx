import React from "react";

export default function ChatWindow({ socket, api, me, activeUser, conversation }) {
  const [messages, setMessages] = React.useState([]);
  const [text, setText] = React.useState("");
  const [typing, setTyping] = React.useState(false);

  React.useEffect(() => {
    if (!conversation?._id) return;
    api.get(`/api/chat/messages/${conversation._id}`).then((r) => setMessages(r.data));
  }, [conversation?._id]);

  React.useEffect(() => {
    function onReceive(msg) {
      // only add if belongs to current conversation
      if (msg?.conversationId === conversation?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    }
    socket.on("receive_message", onReceive);
    return () => socket.off("receive_message", onReceive);
  }, [conversation?._id]);

  async function send() {
    if (!text.trim() || !conversation?._id || !activeUser?._id) return;

    const payload = { conversationId: conversation._id, text: text.trim() };
    const { data: saved } = await api.post("/api/chat/messages", payload);

    setMessages((p) => [...p, saved]);
    setText("");

    // realtime push to other user
    socket.emit("send_message", {
      toUserId: activeUser._id,
      message: saved,
    });
  }

  async function askAI() {
    if (!conversation?._id) return;
    const prompt = text.trim() || "Give a helpful reply for the chat.";
    const { data: aiMsg } = await api.post("/api/ai/reply", { conversationId: conversation._id, prompt });
    setMessages((p) => [...p, aiMsg]);
  }

  return (
    <div className="flex h-full flex-col bg-[#020617]">
      <div className="border-b border-white/10 p-4">
        <p className="text-sm text-[#94A3B8]">Chatting with</p>
        <h2 className="text-lg font-semibold">
          {activeUser ? activeUser.userName : "Select a user"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const mine = m.sender === me._id && m.role !== "ai";
          const isAI = m.role === "ai";
          return (
            <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[78%] rounded-2xl px-4 py-3 text-sm border"
                style={{
                  background: mine ? "rgba(34,211,238,0.12)" : isAI ? "rgba(168,85,247,0.12)" : "rgba(148,163,184,0.08)",
                  borderColor: mine ? "rgba(34,211,238,0.35)" : isAI ? "rgba(168,85,247,0.35)" : "rgba(255,255,255,0.10)",
                }}
              >
                {isAI && <div className="mb-1 text-xs text-[#A855F7] font-semibold">AI</div>}
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 outline-none focus:border-[#22D3EE]/60"
          />
          <button onClick={send} className="rounded-xl bg-[#22D3EE] px-4 py-3 font-semibold text-black hover:opacity-90">
            Send
          </button>
          <button onClick={askAI} className="rounded-xl bg-[#A855F7] px-4 py-3 font-semibold text-white hover:opacity-90">
            AI
          </button>
        </div>
      </div>
    </div>
  );
}
