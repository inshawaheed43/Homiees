// routes/help.route.js
import express from 'express';
import {
  createHelpRequest,
  getAllHelpRequests,
  markResolved
} from '../controllers/help.controller.js';
import {verifyUser} from '../utilis/verifyUser.js';
import verifyAdmin from '../utilis/verifyAdmin.js';

const router = express.Router();

router.post("/", verifyUser, createHelpRequest); // Tenant or Landlord
router.get("/", verifyAdmin, getAllHelpRequests); // Admin
router.put("/:id/resolve", verifyAdmin, markResolved); // Admin

export default router;
