// /api/controllers/chat.controller.js
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// 1. Create Chat Room
export const createChatRoom = async (req, res, next) => {
  const { senderId, receiverId } = req.body;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({ participants: [senderId, receiverId] });
    }

    res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};
// 3. Send Message
// export const sendMessage = async (req, res, next) => {
//   const { chatId, senderId, text } = req.body;
//   console.log("➡️ Sending message:", req.body);
//   try {
//     const message = await Message.create({
//       chatId,
//       senderId,
//       text,
//       readBy: [senderId], // Mark it read for sender
//     });

//     res.status(200).json(message);
//   } catch (err) {
//         console.error("❌ Error in sendMessage:", err); // ✅ Show actual error
//     next(err);
//   }
// };

export const sendMessage = async (req, res, next) => {
  const { chatId, senderId, message } = req.body;
  console.log("➡️ Sending message:", req.body);
  try {
    const newMessage = await Message.create({
      chatId,
      senderId,
      message,
      readBy: [senderId], // Mark it read for sender
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (err) {
    console.error("❌ Error in sendMessage:", err);
    next(err);
  }
};

// 4. Get Messages of a Chat
export const getMessages = async (req, res, next) => {
  const chatId = req.params.chatId;

  try {
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 }) // oldest first
      .populate("senderId", "username avatar");
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

// 5. Mark Messages As Read
export const markMessagesAsRead = async (req, res, next) => {
  const { chatId, userId } = req.body;

  try {
    await Message.updateMany(
      { chatId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    next(err);
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate(
      "participants",
      "username firstName lastName avatar role email"
    );
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// chats that admin can access (in case of any dispute)
export const getAllChatsForAdmin = async (req, res, next) => {
  try {
    const chats = await Chat.find().populate(
      "participants",
      "username email role"
    );
    res.status(200).json(chats);
  } catch (err) {
    next(err);
  }
};
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id, // works for both sender & receiver
    })
      .populate("participants", "username avatar")
      .sort({ updatedAt: -1 }); // most recent first

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: "Failed to get chats" });
  }
};
