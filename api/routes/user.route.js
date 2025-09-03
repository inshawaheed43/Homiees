import express from "express";
import {
  deleteUser,
  getUserListings,
  test,
  updateUser,
  getUser,
  getAllUsers,
  saveListing,
  getCurrentUser,
  getSavedListings,
  getUserById,
  getUserProfileById,
  removeSavedListing,
} from "../controllers/user.controller.js";

import { verifyAdmin, verifyToken, verifyUser } from "../utilis/verifyUser.js";

const router = express.Router();

// ✅ Authenticated user's full profile (includes savedListings)
router.get("/me", verifyUser, getCurrentUser); // 🔥 This points to getMe controller

// ✅ Other routes
router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listing/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser);
router.get("/", verifyAdmin, getAllUsers);
router.get("/:userId", getUserById);
router.get("/profile/:userId", verifyUser, getUserProfileById);
router.post("/save/:listingId", verifyUser, saveListing);
router.delete("/save/:listingId", verifyUser, removeSavedListing);
router.get("/saved", verifyUser, getSavedListings);
export default router;
