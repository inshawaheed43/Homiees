// api/routes/notification.route.js

import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  sendLikeNotification,
} from "../controllers/notification.controller.js";
import { verifyToken, verifyUser } from "../utilis/verifyUser.js";

const router = express.Router();

// router.post("/", verifyUser, createNotification);            // Create new notification
// router.get("/", verifyUser, getUserNotifications);           // Get all for current user
// router.put("/:id/read", verifyUser, markAsRead);             // Mark as read
router.post("/", verifyUser, createNotification); // POST /api/notifications
router.get("/", verifyUser, getUserNotifications);
// router.get("/", verifyUser, getUserNotifications);
router.post("/like", verifyToken, sendLikeNotification);
export default router;
