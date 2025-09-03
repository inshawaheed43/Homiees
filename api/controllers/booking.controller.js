import Booking from "../models/booking.model.js";
import Listing from "../models/listing.model.js";

// ✅ Create a booking using tenantRef, landlordRef, listingRef
export const createBooking = async (req, res, next) => {
  try {
    const { listingRef, viewingDateTime, status } = req.body;

    // 🔍 Validate required fields
    if (!listingRef || !viewingDateTime) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // 🔍 Fetch the listing by ID
    const foundListing = await Listing.findById(listingRef);
    if (!foundListing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    // ✅ Create booking
    const newBooking = new Booking({
      tenantRef: req.user._id, // Authenticated tenant
      listingRef: foundListing._id, // Correct model field
      landlordRef: foundListing.userRef, // Ensure userRef exists in Listing model
      viewingDateTime,
      status,
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: savedBooking,
    });
  } catch (err) {
    console.error("❌ Booking creation failed:", err.message);
    return next(err);
  }
};

// ✅ Get all bookings for a tenant
export const getTenantBookings = async (req, res, next) => {
  try {
    const tenantId = req.params.tenantId;

    const bookings = await Booking.find({ tenantRef: tenantId })
      .populate("listingRef")
      .populate("landlordRef", "username email");

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};

export const getLandlordBookings = async (req, res, next) => {
  try {
    const landlordId = req.params.landlordId;

    const bookings = await Booking.find({ landlordRef: landlordId })
      .populate("listingRef")
      .populate("tenantRef", "username email");

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};

// ✅ Update booking status (approve/reject)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};
