// controllers/help.controller.js
import HelpRequest from '../models/helpRequest.model.js';

export const createHelpRequest = async (req, res) => {
  try {
    const { message, category } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    console.log("🔍 Creating help request for:", { userId, role });
  if (!message || !role || !userId || !category) {
      return res.status(400).json({ message: "Message, user info, and category are required" });
    }
    const request = new HelpRequest({
      userId,
      role,
      message,
      category,
    });

    await request.save();
    res.status(201).json({ message: "Request submitted" });
  } catch (err) {
    console.error("Error creating help request:", err);
    res.status(500).json({ message: "Failed to submit request" });
  }
};

export const getAllHelpRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find().populate("userId", "username email");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch help requests" });
  }
};


export const markResolved = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id).populate("userId");

    if (!helpRequest) {
      return res.status(404).json({ success: false, message: "Help request not found" });
    }

    helpRequest.status = "resolved";
    await helpRequest.save();

    // ✅ Send notification to the user (tenant or landlord)
    await Notification.create({
      userId: helpRequest.userId._id,
      message: "Your help request has been resolved by the Admin.",
        type: "help",
    });

    return res.status(200).json({ success: true, message: "Resolved and user notified." });
  } catch (err) {
    console.error("Error resolving help request:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
