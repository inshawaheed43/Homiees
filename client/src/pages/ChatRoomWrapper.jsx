import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import ChatList from "../components/ChatList";
// import ChatWindow from "../components/ChatWindow";

export default function ChatRoomWrapper() {
  const { currentUser } = useSelector((state) => state.user);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`/api/chat/${currentUser._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };

    if (currentUser?._id) fetchChats();
  }, [currentUser]);

  return (
    <div className="flex h-screen">
      <ChatList chats={chats} currentUserId={currentUser._id} />
      <ChatWindow />
    </div>
  );
}
