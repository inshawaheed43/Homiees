import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminChatroomView() {
  const { chatId } = useParams(); // 🆔 The chatroom ID from the URL
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/admin/chatrooms/messages/${chatId}`, {
          method: "GET",
          credentials: "include", // send cookies/JWT
        });
        const data = await res.json();
        console.log("Messages API response:", data); 

        setMessages(data.messages);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [chatId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chatroom ID: {chatId}</h2>
      <div style={{ border: "1px solid #ccc", padding: "10px", maxHeight: "400px", overflowY: "auto" }}>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} style={{ marginBottom: "8px" }}>
              <strong>{msg.senderId.username}:</strong> {msg.message}
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>
    </div>
  );
}
