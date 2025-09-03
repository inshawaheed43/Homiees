// client/src/components/Admin/ChatroomsTab.jsx

import React, { useEffect, useState } from "react";

export default function ChatroomsTab() {
  const [chatrooms, setChatrooms] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const res = await fetch("/api/admin/chatrooms", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setChatrooms(data);
        }
      } catch (err) {
        console.error("Failed to load chatrooms");
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChatrooms();
  }, []);

  const viewMessages = async (chatId) => {
    setSelectedChatId(chatId);
    setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/admin/chatrooms/${chatId}/messages`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load messages");
    } finally {
      setLoadingMsgs(false);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Chatroom list */}
      <div className="w-1/2">
        <h2 className="text-xl font-bold mb-2">All Chatrooms</h2>
        {loadingChats ? (
          <p>Loading chatrooms...</p>
        ) : (
          <ul className="space-y-2">
            {chatrooms.map((chat) => (
              <li
                key={chat._id}
                className="border p-2 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => viewMessages(chat._id)}
              >
                <strong>Members:</strong>{" "}
                {chat.members.map((m) => m.username).join(", ")}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Messages viewer */}
      <div className="w-1/2">
        <h2 className="text-xl font-bold mb-2">Messages</h2>
        {loadingMsgs ? (
          <p>Loading messages...</p>
        ) : selectedChatId ? (
          <ul className="space-y-2 max-h-[400px] overflow-y-auto border p-2 rounded">
            {messages.map((msg) => (
              <li key={msg._id} className="p-2 bg-gray-100 rounded">
                <strong>{msg.sender.username}</strong>: {msg.text}
              </li>
            ))}
          </ul>
        ) : (
          <p>Select a chatroom to view messages</p>
        )}
      </div>
    </div>
  );
}
