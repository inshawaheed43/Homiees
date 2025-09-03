import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { withCredentials: true });

const Contact = ({ landlordId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { chatId: roomId } = useParams(); // ✅ roomId from URL
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!roomId) return;

    const fetchChat = async () => {
      try {
        const res = await fetch(`/api/message/${roomId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setMessages(data || []);
      } catch (err) {
        console.error("Failed to load chat", err);
      }
    };

    fetchChat();
    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const msgData = {
      chatId: roomId,
      senderId: currentUser._id,
      message,
    };

    // Save message to DB
    await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(msgData),
    });

    socket.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  const handleStartChat = async () => {
    try {
      const res = await fetch("/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          tenantId: currentUser._id,
          landlordId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create chat");

      navigate(`/chat/${data.chatId}`);
    } catch (err) {
      console.error("Error creating chat:", err.message);
    }
  };

  return (
    <div className="contact-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.senderId === currentUser._id ? "Me" : "Them"}:</strong> {msg.message}
          </p>
        ))}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <button onClick={handleStartChat} className="chat-btn">
        Message Landlord
      </button>
    </div>
  );
};

export default Contact;
