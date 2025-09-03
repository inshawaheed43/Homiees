import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const sendMessage = async (req, res, next) => {
  const { chatId, senderId, message } = req.body;

  try {
    // 1. Save message
    const newMessage = await Message.create({
      chatId,
      senderId,
      message,
      readBy: [senderId],
    });

    // 2. Update chat with lastMessage & updatedAt
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message,
      updatedAt: new Date(),
    });

    // 3. Find chat participants
    const chat = await Chat.findById(chatId).populate(
      "participants",
      "_id username"
    );

    // 4. Determine recipient (not sender)
    const recipient = chat.participants.find(
      (user) => user._id.toString() !== senderId
    );

    // 5. Send notification to recipient
    if (recipient) {
      const sender = await User.findById(senderId);
      await Notification.create({
        userId: recipient._id,
        senderId: senderId,
        type: "message",
        chatId: chat._id,
        message: `📩 You've got an unread message from @${sender.username}`,
      });
    }

    // ✅ Consistent response
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (err) {
    next(err);
  }
};

export const getMessagesByChatId = async (req, res, next) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 }) // oldest first for chat flow
      .populate("senderId", "username avatar")
      .lean();

    res.status(200).json(messages);
  } catch (err) {
    next(err);
    console.log(err);
  }
};
