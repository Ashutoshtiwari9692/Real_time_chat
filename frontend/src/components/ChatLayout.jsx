import React from "react";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";

export default function ChatLayout({ socket, api, me }) {
  const [users, setUsers] = React.useState([]);
  const [online, setOnline] = React.useState([]);
  const [activeUser, setActiveUser] = React.useState(null);
  const [conversation, setConversation] = React.useState(null);

  React.useEffect(() => {
    api.get("/api/chat/users").then((r) => setUsers(r.data));
    socket.on("online_users", setOnline);
    return () => socket.off("online_users");
  }, []);

  async function openChat(user) {
    setActiveUser(user);
    const { data } = await api.post("/api/chat/conversation", { otherUserId: user._id });
    setConversation(data);
  }

  return (
    <div className="h-screen w-full grid grid-cols-1 md:grid-cols-[360px_1fr]">
      <Sidebar users={users} online={online} activeUser={activeUser} onSelect={openChat} me={me} />
      <ChatWindow socket={socket} api={api} me={me} activeUser={activeUser} conversation={conversation} />
    </div>
  );
}
