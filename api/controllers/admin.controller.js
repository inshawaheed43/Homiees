import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import Notification from '../models/notification.model.js';
import HelpRequest from '../models/helpRequest.model.js';
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json("Failed to fetch users.");
  }
};
export const getBannedUsers = async (req, res, next) => {
  try {
    const bannedUsers = await User.find({ isBanned: true });
    res.status(200).json(bannedUsers);
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find().populate({
      path: "userRef",
      select: "username email",
    });
    console.log(listings[0]);
    res.status(200).json(listings);
  } catch (error) {
    console.error("❌ Failed to fetch listings:", error);
    res.status(500).json({ message: "Server error fetching listings" });
  }
};
export const deleteListingByAdmin = async (req, res, next) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    next(err);
  }
};
export const getAllChatrooms = async (req, res) => {
  try {
    const chatrooms = await Chat.find()
      .populate("participants", "username email role")
      .lean();

    const chatroomsWithMessages = await Promise.all(
      chatrooms.map(async (room) => {
        const lastMessage = await Message.findOne({ chatId: room._id })

          .sort({ createdAt: -1 })
          .limit(1);
        return {
          ...room,
          lastMessage: lastMessage ? lastMessage.text : "No messages yet",
        };
      })
    );

    res.status(200).json(chatroomsWithMessages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chatrooms", error });
  }
};

export const getMessagesByChatId = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("sender", "username role");
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json("Failed to fetch messages.");
  }
};
export const deleteUserByAdmin = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
export const manuallyVerifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isManuallyVerified: true },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to verify user manually" });
  }
};
export const banUserByAdmin = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { isBanned: true });
    res.status(200).json({ message: "User banned successfully" });
  } catch (error) {
    next(error);
  }
};
export const unbanUserByAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBanned: false },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to unban user" });
  }
};
export const getManuallyVerifiedUsers = async (req, res) => {
  try {
    const users = await User.find({ isManuallyVerified: true });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch verified users" });
  }
};
export const getHelpRequests = async (req, res, next) => {
  try {
    const requests = await HelpRequest.find().populate('userId', 'username email');
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};
export const resolveHelpRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;

    const request = await HelpRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Help request not found' });
    }

    // Mark the request as resolved
    request.status = 'resolved';
    await request.save();

    // Create notification for the user who submitted the request
    const notification = new Notification({
      userId: request.userId,
      message: 'Your help request has been resolved by the admin.',
      type: "help", 
    });

    await notification.save();

    res.status(200).json({ success: true, message: 'Request resolved and user notified.' });
  } catch (error) {
    next(error);
  }
};
export const deleteHelpRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Help request not found" });
    res.status(200).json({ success: true, message: "Help request deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete help request" });
  }
};