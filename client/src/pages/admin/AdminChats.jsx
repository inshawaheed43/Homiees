import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const res = await fetch("/api/admin/chatrooms", {
          credentials: "include",
        });
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        setChats(data);
      } catch (err) {
        setError("Failed to load chatrooms");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatrooms();
  }, []);

  if (loading) return <p>Loading chatrooms...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Chatrooms & Disputes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chats.map((chat) => (
          <div key={chat._id} className="border p-4 rounded-lg shadow-sm bg-white">
            <h3 className="text-lg font-semibold mb-2">Chatroom ID: {chat._id}</h3>

            <p>
              <strong>Participants:</strong>{" "}
              {Array.isArray(chat.participants)
                ? chat.participants
                    .map((p) => `${p.username} (${p.role})`)
                    .join(", ")
                : "Unknown"}
            </p>

            <p>
              <strong>Last Message:</strong>{" "}
              {chat.lastMessage || "No message"}
            </p>

            <p>
              <strong>Updated:</strong>{" "}
              {chat.updatedAt
                ? new Date(chat.updatedAt).toLocaleString()
                : "N/A"}
            </p>

            <button
              onClick={() => navigate(`/admin/chatroom/${chat._id}`)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Chatroom
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
