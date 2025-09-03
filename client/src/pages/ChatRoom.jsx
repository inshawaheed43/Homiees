/**
 * ChatRoom.jsx
 * ---------------------------------------
 * This page displays a chat between tenant and landlord.
 * It loads previous messages from MongoDB and listens for real-time updates via Socket.IO.
 * Only tenants and landlords can send messages. Admins have read-only access (RBAC enforced).
 */

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { FaPaperPlane } from "react-icons/fa";

// Socket.IO client connection
const socket = io("http://localhost:3000", {
  withCredentials: true,
});

const ChatRoom = () => {
  // Get chat ID from URL
  const { chatId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [otherUser, setOtherUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  /**
   * Fetch chat history from backend when chat loads
   * Join the socket room for live messaging
   */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/message/${chatId}`, {
          credentials: "include",
        });
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    socket.emit("joinRoom", chatId);

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup socket on unmount
    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [chatId]);

  /**
   * Automatically scroll to the latest message
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    const fetchChatroom = async () => {
      try {
        const res = await fetch(`/api/chat/${chatId}`, { credentials: "include" });
        const data = await res.json();
        // Assuming data.participants is an array of user objects
        if (Array.isArray(data.participants)) {
          const other = data.participants.find(u => u._id !== currentUser._id);
          setOtherUser(other);
        }
      } catch (err) {
        console.error("Error fetching chatroom:", err);
      }
    };
    fetchChatroom();
  }, [chatId, currentUser._id]);
  /**
   * Handle sending a message
   * Saves message to DB and emits via socket
   */
  const handleSend = async () => {
    if (!message.trim()) return;

    const msgData = {
      chatId,
      senderId: currentUser._id,
      message,
      
    };

    // Save message to DB
    await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(msgData),
    });

    // Emit message to others
    socket.emit("sendMessage", msgData);

    // Update local UI
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5EDE8] mx-8 my-4">
      {/* Header */}
      <div className="p-4  mt-10 rounded-full text-center bg-[#354f69] text-white text-lg  font-semibold shadow">
        <div className="flex items-center gap-4 p-4 rounded-full bg-[#354f69] text-white text-lg font-semibold shadow">
          {otherUser && (
            <>
              <img
                src={otherUser.avatar || "/default-avatar.png"}
                alt={otherUser.username}
                className="w-10 h-10 rounded-full object-cover border border-white"
              />
              <span>{otherUser.firstName} {otherUser.lastName} ({otherUser.role})</span>
            </>
          )}
          {!otherUser && <span>Chat Room</span>}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F5EDE8]">
        {Array.isArray(messages) &&
          messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 mb-2 rounded-lg shadow text-sm ${msg.senderId === currentUser._id
                ? "bg-[#354f69] text-white ml-auto"
                : "bg-white text-gray-800 mr-auto"
                }`}
            >
              {msg.message}
            </div>
          ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Message Input (RBAC Check) */}
      {currentUser?.role !== "admin" && (
        <div className="p-4 flex items-center gap-2 bg-white  rounded-full border-t ">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-2 bg-[#354f69] text-white rounded-full"
          >
            <FaPaperPlane />
          </button>
        </div>
      )}

      {/* Show message for Admin users */}
      {currentUser?.role === "admin" && (
        <div className="p-4 text-sm text-center text-gray-500">
          Admins can view this chat but cannot send messages.
        </div>
      )}
    </div>
  );
};

export default ChatRoom;


// import React, { useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// export default function ChatRoom() {
//   const { currentUser } = useSelector((state) => state.user);
//   const { chatId } = useParams()
//   const [chats, setChats] = useState([]);
//   const [selectedChatId, setSelectedChatId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const messageEndRef = useRef();

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const res = await fetch(`/api/chat/user-chats`, {
//           credentials: "include",
//         });
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setChats(data);
//         } else {
//           setChats([]);
//         }
//       } catch (err) {
//         console.error("Failed to fetch chats", err);
//       }
//     };

//     if (currentUser?._id) fetchChats();
//   }, [currentUser]);

//   const otherUser = (chat) =>
//     chat.participants.find((u) => u._id !== currentUser._id);

//   const fetchMessages = async (chatId) => {
//     try {
//       const res = await fetch(`/api/message/${chatId}`, {
//         credentials: "include",
//       });
//       const data = await res.json();
//       setMessages(data);
//       scrollToBottom();
//     } catch (err) {
//       console.error("Failed to fetch messages", err);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       const res = await fetch(`/api/message/send`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           chatId: selectedChatId,
//           senderId: currentUser._id,
//           message: newMessage,
//         }),
//       });
//       const data = await res.json();
//       setMessages((prev) => [...prev, data]);
//       setNewMessage("");
//       scrollToBottom();
//     } catch (err) {
//       console.error("Failed to send message", err);
//     }
//   };

//   const handleChatClick = (chatId) => {
//     setSelectedChatId(chatId);
//     fetchMessages(chatId);
//   };

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Chat List */}
//       <div className="w-1/3 border-r overflow-y-auto">
//         <h2 className="p-4 text-xl font-semibold">Chats</h2>
//         {chats.length === 0 ? (
//           <p className="p-4 text-gray-500">No chats found</p>
//         ) : (
//           chats.map((chat) => {
//             const user = otherUser(chat);
//             return (
//               <div
//                 key={chat._id}
//                 className={`flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer ${selectedChatId === chat._id ? "bg-gray-200" : ""
//                   }`}
//                 onClick={() => handleChatClick(chat._id)}
//               >
//                 <img
//                   src={user.avatar || "/default-avatar.png"}
//                   alt={user.username}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <div>
//                   <div className="font-semibold">{user.username}</div>
//                 </div>
//                 <span
//                   className={`ml-auto w-3 h-3 rounded-full ${user.isOnline ? "bg-green-500" : "bg-gray-400"
//                     }`}
//                 ></span>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Chat Window */}
//       <div className="w-2/3 flex flex-col p-6">
//         {selectedChatId ? (
//           <>
//             <div className="flex-1 overflow-y-auto space-y-2 pr-2">
//               {messages.map((msg) => (
//                 <div
//                   key={msg._id}
//                   className={`p-2 rounded-md max-w-xs ${msg.senderId._id === currentUser._id
//                       ? "ml-auto bg-blue-500 text-white"
//                       : "bg-gray-200 text-gray-800"
//                     }`}
//                 >
//                   {msg.message}
//                 </div>
//               ))}
//               <div ref={messageEndRef} />
//             </div>

//             {/* Input Box */}
//             <div className="mt-4 flex gap-2">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                 className="flex-1 border rounded-lg px-3 py-2 outline-none"
//                 placeholder="Type a message..."
//               />
//               <button
//                 onClick={handleSendMessage}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//               >
//                 Send
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className="text-gray-400 text-lg m-auto">
//             Select a chat to start messaging
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
