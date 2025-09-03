import Listing from "../models/listing.model.js";
import { errorHandler } from "../utilis/error.js";
import fetch from "node-fetch";

export const createListing = async (req, res, next) => {
  try {
    const {
      name,
      description,
      regularPrice,
      discountedPrice,
      address,
      city,
      state,
      country,
      bedrooms,
      bathrooms,
      furnished,
      parking,
      electricity,
      gas,
      offer,
      type,
      imageUrls,
      videoUrls, // ✅ add this
      latitude,
      longitude,
      landlordRef,
    } = req.body;
    const fullAddress = `${address}, ${city}, ${state}, ${country}`;

    console.log("📦 Full address for geocoding:", fullAddress);

    const coords = await getCoordinates(fullAddress);

    if (coords) {
      req.body.latitude = coords.latitude;
      req.body.longitude = coords.longitude;
    } else {
      // fallback default (optional)
      req.body.latitude = 32.1617;
      req.body.longitude = 74.1883;
    }
    console.log("🛠 Final Data to Save:", req.body);

    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
    console.log("✅ Listing created:", listing);
  } catch (err) {
    console.error("❌ Error in createListing:", err);
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(401, "Listing not found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own Listings! "));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

// landlord want to see his listings
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

//appears for others
export const getListings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const normalizeBooleanFilter = (value) => {
      if (value === undefined || value === "false")
        return { $in: [false, true] };
      if (value === "true") return true;
      return { $in: [false, true] };
    };

    const offer = normalizeBooleanFilter(req.query.offer);
    const furnished = normalizeBooleanFilter(req.query.furnished);
    const parking = normalizeBooleanFilter(req.query.parking);
    const gas = normalizeBooleanFilter(req.query.gas);
    const electricity = normalizeBooleanFilter(req.query.electricity);

    let type = req.query.type;
    if (!type || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const filters = {
      name: { $regex: searchTerm, $options: "i" },
      ...(req.query.location &&
        req.query.location !== "all" && {
          address: { $regex: req.query.location, $options: "i" },
        }),
      ...(req.query.offer !== undefined && { offer }),
      ...(req.query.furnished !== undefined && { furnished }),
      ...(req.query.parking !== undefined && { parking }),
      ...(type && { type }),
      ...(req.query.gas !== undefined && { gas }),
      ...(req.query.electricity !== undefined && { electricity }),
    };

    const listings = await Listing.find(filters)
      .sort({ [sort]: order })
      .skip(skip)
      .limit(limit);

    const total = await Listing.countDocuments(filters);
    console.log("FILTERS USED:", filters);
    console.log("PAGE:", page, "LIMIT:", limit, "SKIP:", skip);
    console.log("TOTAL COUNT:", total);

    return res.status(200).json({ listings, total });
  } catch (error) {
    next(error);
  }
};

const getCoordinates = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await response.json();

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      console.warn("❌ No coordinates found for address:", address);
      return null;
    }
  } catch (error) {
    console.error("🔥 Geocoding error:", error);
    return null;
  }
};
