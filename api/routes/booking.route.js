import express from "express";
import {
  createBooking,
  getTenantBookings,
  getLandlordBookings,
  updateBookingStatus,
} from "../controllers/booking.controller.js";

import {verifyUser} from "../utilis/verifyUser.js";

const router = express.Router();

// Tenant creates a booking
router.post("/create", verifyUser, createBooking);

// Tenant views own bookings
router.get("/tenant/:tenantId", verifyUser, getTenantBookings);

// Landlord views bookings for their listings
router.get("/landlord/:landlordId", verifyUser, getLandlordBookings);

// Landlord updates booking status (approve/reject)
router.put("/status/:bookingId", verifyUser, updateBookingStatus);

export default router;
