import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/user.model.js";

// ✅ Middleware: General token verification
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = decoded;
    next();
  });
};

// ✅ Middleware: Verify that user is logged in (for normal users)
export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
};

// ✅ Middleware: Admin only
export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Token verification failed" });
  }
};

// ✅ Middleware: Landlords only
export const verifyLandlord = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "landlord") {
      next();
    } else {
      return next(errorHandler(403, "Landlords only"));
    }
  });
};

// ✅ Middleware: Tenants only
export const verifyTenant = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "tenant") {
      next();
    } else {
      return next(errorHandler(403, "Tenants only"));
    }
  });
};
