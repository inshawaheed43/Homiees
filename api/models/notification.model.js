// api/models/notification.model.js

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      // Who receives this notification
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      // Optional: who triggered the notification (sender of the message)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      // What kind of notification (chat or wishlist)
      type: String,
      enum: ["message", "wishlist", "help", "like"], // add "like" if you want
      required: true,
    },
    message: {
      // Text to show in the UI
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    chatId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Chat",
}

  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
