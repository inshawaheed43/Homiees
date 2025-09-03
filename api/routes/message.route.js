import express from "express";
import {
  sendMessage,
  getMessagesByChatId,
} from "../controllers/message.controller.js";
// import verifyUser from "../utilis/verifyUser.js";
import { verifyToken, verifyUser } from "../utilis/verifyUser.js";

const router = express.Router();

router.post("/messages", verifyToken, sendMessage); // to save a message
router.get("/messages/:chatId", getMessagesByChatId);

export default router;
