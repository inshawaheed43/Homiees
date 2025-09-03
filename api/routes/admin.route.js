import express from "express";
import {
  getAllUsers,
  getBannedUsers,
  getAllListings,
  deleteListingByAdmin,
  getAllChatrooms,
  getMessagesByChatId,
  deleteUserByAdmin,
  manuallyVerifyUser,         
  banUserByAdmin,             
  unbanUserByAdmin,           
  getManuallyVerifiedUsers  ,
  getHelpRequests,deleteHelpRequest,
  resolveHelpRequest
} from "../controllers/admin.controller.js";
import verifyAdmin from "../utilis/verifyAdmin.js";

import { verifyToken } from "../utilis/verifyUser.js";



const router = express.Router();



router.get("/users", verifyAdmin, getAllUsers);


router.get('/help-requests', getHelpRequests);


router.get("/banned-users", verifyAdmin, getBannedUsers); 

router.put('/help-requests/:id/resolve', resolveHelpRequest); // ✅ ADD THIS
router.delete("/help-requests/:id", verifyAdmin, deleteHelpRequest);


router.get("/verified-users", verifyAdmin, getManuallyVerifiedUsers); // ✅



router.put("/users/:userId/verify", verifyAdmin, manuallyVerifyUser);  // ✅




router.put("/users/:userId/ban", verifyAdmin, banUserByAdmin);         // ✅




router.put("/users/:userId/unban", verifyAdmin, unbanUserByAdmin);     // ✅




router.delete("/users/:userId", verifyAdmin, deleteUserByAdmin);    




router.get("/listings", verifyAdmin, getAllListings);





router.delete("/listing/:id", verifyAdmin, deleteListingByAdmin);




router.get("/chatrooms", verifyAdmin, getAllChatrooms);





router.get("/chatrooms/:chatId/messages", verifyToken ,verifyAdmin, getMessagesByChatId);

export default router;
