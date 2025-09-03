// /api/routes/chat.route.js
import express from "express";
import {
  createChatRoom,
  getUserChats,
  sendMessage,
  getMessages,
  markMessagesAsRead,
  getChatById,
} from "../controllers/chat.controller.js";
import { verifyToken, verifyUser } from "../utilis/verifyUser.js";

const router = express.Router();

// Create a new chat room (tenant ↔ landlord)
router.post("/create", createChatRoom);

// Get all chat rooms for a user
router.get("/user/:userId", getUserChats);

// Send a message in a chat
router.post("/send", sendMessage);

// Get all messages for a chat room
router.get("/messages/:chatId", getMessages);

// Mark messages as read
router.put("/read", markMessagesAsRead);
// router.get("/:chatId", verifyToken, getChatById);
router.get("/", verifyUser, getUserChats);
router.get("/user-chats", verifyUser, getUserChats);
router.get("/:chatId", verifyUser, getChatById); // Load single chat

export default router;
