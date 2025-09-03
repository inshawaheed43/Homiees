import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utilis/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "API is working",
  });
};

export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  console.log("Incoming update request for userId:", userId);
  console.log("Request Body:", req.body);
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          city: req.body.city,
          country: req.body.country,
          state: req.body.state,
          address: req.body.address,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    return res.status(200).json({ success: true, user: rest });
  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    console.log("🧨 Delete request received by user:", req.user.id);
    console.log("User trying to delete:", req.params.id);

    if (req.user.id !== req.params.id) {
      console.log("❌ Unauthorized delete attempt");
      return res.status(401).json({
        success: false,
        message: "You can only delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");

    console.log("✅ User deleted successfully");
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log("❌ Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the user",
    });
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching current user:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User Not Found!"));
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
// For admin only
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    next(errorHandler(500, "Failed to fetch users"));
  }
};

export const saveListing = async (req, res) => {
  try {
    // ✅ Get the logged-in user from token middleware
    const loggedInUserId = req.user.id;

    // ✅ Find the listing by ID
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // ✅ Ensure the userRef is valid (optional if needed for extra checks)
    if (listing.userRef.toString() === loggedInUserId) {
      return res
        .status(400)
        .json({ error: "You cannot save your own listing" });
    }

    // ✅ Find the logged-in user
    const user = await User.findById(loggedInUserId);

    // ✅ Add listing to savedListings if not already there
    if (!user.savedListings.includes(listing._id)) {
      user.savedListings.push(listing._id);
      await user.save();
    }

    res.status(200).json({ message: "Listing saved successfully" });
  } catch (err) {
    console.error("Error saving listing:", err);
    res.status(500).json({ error: "Failed to save listing" });
  }
};

export const removeSavedListing = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedListings = user.savedListings.filter(
      (id) => id.toString() !== req.params.listingId
    );
    await user.save();
    res.status(200).json({ message: "Listing removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove listing" });
  }
};

export const getSavedListings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedListings");
    res.status(200).json(user.savedListings);
  } catch (err) {
    res.status(500).json({ error: "Failed to get saved listings" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedListings");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "-password -__v"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// @desc Get user profile (admin or public view)
// @route GET /api/user/profile/:userId
// @access Private
export const getUserProfileById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user.id;
    const viewerRole = req.user.role;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If viewer is admin OR the user himself, send full profile
    const isSelf = viewerId === userId;
    if (viewerRole === "admin" || isSelf) {
      return res.status(200).json(user);
    }

    // Else, return only public-safe fields
    const publicUserData = {
      _id: user._id,
      username: user.username,
      role: user.role,
      profilePicture: user.profilePicture,
      city: user.city,
      country: user.country,
      listings: user.listings, // optional: you can decide to include this
    };

    return res.status(200).json(publicUserData);
  } catch (err) {
    next(err);
  }
};
