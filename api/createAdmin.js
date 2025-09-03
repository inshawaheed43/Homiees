// api/createAdmin.js

import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
import bcrypt from "bcrypt"; 
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/user.model.js";

// Get the real path (ES Module way)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root and use MONGO key
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("MONGO value loaded:", process.env.MONGO); // Should show full MongoDB URI

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to DB ✅");

    const existing = await User.findOne({ email: "waheedinsha02@gmail.com" });
    if (existing) {
      console.log("Admin already exists ❌");
      return;
    }

    const hashedPassword = await bcrypt.hash("insha@homi", 10);

    const admin = new User({
      username: "waheedinsha02",
      email: "waheedinsha02@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    process.exit();
  } catch (err) {
    console.error("Error creating admin ❌", err);
    process.exit(1);
  }
};

createAdmin();
const users = await User.find({ role: "admin" });
console.log("Admins in database:", users);
