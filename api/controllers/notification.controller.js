// api/controllers/notification.controller.js

import Notification from "../models/notification.model.js";

// Create new notification
export const createNotification = async (req, res, next) => {
  try {
    const { userId, type, message } = req.body;

    const notification = await Notification.create({ userId, type, message });

    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
};
// Get all notifications for logged-in user
export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id; // ✅ Get user ID from JWT
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};
// Mark notification as read
export const markAsRead = async (req, res, next) => {
 try {
    const { notificationId } = req.params;

    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

export const sendLikeNotification = async (req, res) => {
  try {
    const { landlordId, listingId, likerUsername } = req.body;
    if (!landlordId || !likerUsername) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }
    await Notification.create({
      userId: landlordId,
      type: "like",
      message: `Hey, @${likerUsername} liked your property.`,
      isRead: false,
    });
    res.status(200).json({ success: true, message: "Notification sent" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to send notification" });
  }
};
export const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const unread = await Notification.find({ 
      userId,
      isRead: false,
      type: 'chat'  // Only chat-related
    }).sort({ createdAt: -1 });

    res.status(200).json(unread);
  } catch (err) {
    console.error('Error fetching unread notifications:', err);
    res.status(500).json({ message: 'Server error fetching unread notifications' });
  }
};
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { userId, isRead: false, type: 'chat' },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications" });
  }
};
