import { errorHandler } from "../utilis/error.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const signup = async (req, res, next) => {
  console.log("Signup body:", req.body);
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const allowedRoles = ["tenant", "landlord", "admin"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role. Must be 'Tenant' or 'Landlord'",
    });
  }
const existingUser = await User.findOne({ email });
if (existingUser) {
  return res
    .status(400)
    .json({ success: false, message: "Email already in use" });
}
  try {
    // ✅ 2. Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // ✅ 3. Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // ✅ 4. Create user (unverified initially)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      state: req.body.state,
      city: req.body.city,
      country: req.body.country,
      address: req.body.address,
      isVerified: false,
      verificationToken,
    });

    await newUser.save();

    // ✅ 5. Send verification email
    const verifyUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;
    const transporter = nodemailer.createTransport({
      service: "gmail", // or Mailtrap, SendGrid, etc.
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Homiees" <no-reply@Homiees.com>',
      to: email,
      subject: "Kindly Verify your email",
      html: `<p>Hello ${username},</p>
             <p> Welcome to Homiees! Please verify your email by clicking the link below:</p>
             <a href="${verifyUrl}">Verify Email</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Verification email sent",
      token: newUser.verificationToken, 
        userId: newUser._id, // ✅ Add this

    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
const token = req.params.token || req.query.token;


  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Missing verification token" });
  }

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired token" });
    }

   user.isVerified = true;
user.verificationToken = undefined;
await user.save();

const { password, verificationToken, ...safeUser } = user._doc;

res.status(200).json({
  success: true,
  message: "Email verified successfully",
  user: safeUser,
});

  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (!validUser.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify your email first" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" } // optional: token expiry
    );

    // ✅ Remove sensitive info
    const { password: pass, verificationToken, ...rest } = validUser._doc;

    // ✅ Return user data + token
   res
  .cookie("access_token", token, {
    httpOnly: true,
    sameSite: "Lax",
  })
  .status(200)
  .json({
    success: true,
    message: "Login successful",
    user: rest, // contains user data
  });


  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    // 🔒 Block admin email from using Google OAuth
    if (email === "waheedinsha02@gmail.com") {
      return res.status(403).json({
        success: false,
        message: "Admin must log in via Admin Panel only.",
      });
    }

    // ✅ Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      const { password, ...rest } = user._doc;

      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({ ...rest });
    }

    // 🔐 New user creation
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const newUser = new User({
      username:
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email,
      password: hashedPassword,
      avatar,
      role: "landlord", // ✅ Always assign landlord to Google users
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password, ...rest } = newUser._doc;

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ ...rest });
  } catch (error) {
    console.error("OAuth Error:", error);
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
export const adminSignin = async (req, res, next) => {
  console.log("📥 Admin login attempt:");
console.log("Email:", req.body.email);
console.log("Password:", req.body.password);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: pass, ...rest } = user._doc;

    res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

