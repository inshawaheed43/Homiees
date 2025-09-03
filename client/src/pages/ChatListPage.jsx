// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// export default function ChatListPage() {
//   const [chatrooms, setChatrooms] = useState([]);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { currentUser } = useSelector((state) => state.user);

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const res = await fetch("/api/chat", {
//           credentials: "include",
//         });
//         const data = await res.json();
//         if (!res.ok) {
//           throw new Error(data.message || "Failed to fetch chats");
//         }
//         setChatrooms(data);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchChats();
//   }, []);

//   const getOtherUser = (chat) => {
//     return chat.participants.find(
//       (user) => user._id !== currentUser._id
//     );
//   };

//   const getLastMessage = (messages) => {
//     if (!messages || messages.length === 0) return "No messages yet.";
//     return messages[messages.length - 1].text;
//   };

//   if (error) {
//     return <p className="text-red-500 text-center">{error}</p>;
//   }

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4 text-center text-[#354f69]">Your Chats</h2>

//       {chatrooms.length === 0 ? (
//         <p className="text-gray-500 text-center">No chats found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {chatrooms.map((chat) => {
//             const otherUser = getOtherUser(chat);
//             return (
//               <li
//                 key={chat._id}
//                 onClick={() => navigate(`/chat/${chat._id}`)}
//                 className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
//               >
//                 <div className="flex items-center gap-4">
//                   <img
//                     src={otherUser?.avatar || "/default-avatar.png"}
//                     alt="User Avatar"
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   <div>
//                     <h3 className="text-lg font-semibold text-[#354f69]">{otherUser?.username || "Unknown"}</h3>
//                     <p className="text-sm text-gray-600">{getLastMessage(chat.messages)}</p>
//                   </div>
//                 </div>
//                 <span className="text-sm text-gray-400">{new Date(chat.updatedAt).toLocaleTimeString()}</span>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ChatListPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
console.log("Participants:", chats.participants);
console.log("CurrentUser ID:", currentUser?._id);

  // useEffect(() => {
  //   const fetchChats = async () => {
  //     try {
  //       const res = await fetch("/api/chat/user-chats", {
  //         credentials: "include",
  //       });
  //       const data = await res.json();
  //       setChats(Array.isArray(data.chats) ? data.chats : []);
  //     } catch (err) {
  //       console.error("Error fetching chat list:", err);
  //     }
  //   };

  //   fetchChats();
  // }, []);



  useEffect(() => {
  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chat/user-chats", {
              method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      console.log("Fetched chat data:", data);

      if (!Array.isArray(data)) {
        console.warn("Expected array but got:", typeof data);
        setChats([]);
        return;
      }

      setChats(data);
    } catch (err) {
      console.error("❌ Error fetching chat list:", err);
    }
  };

  fetchChats();
}, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 mt-6 text-center">Shared Room</h2>
     {chats.map((chat) => {
  if (!chat.participants || !Array.isArray(chat.participants)) {
    return null; // skip broken chat data
  }

  const otherUser = chat.participants.find((u) => u._id !== currentUser?._id);

  if (!otherUser) {
    return null;
  }
        return (
          <div
            key={chat._id}
            onClick={() => navigate(`/chatroom/${chat._id}`)}
            className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-3 border-b"
          >
            <img
              src={otherUser.avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-14 h-14 rounded-full"
            />
            <span>{otherUser.username}</span>
          </div>
        );
      })}
    </div>
  );
}
