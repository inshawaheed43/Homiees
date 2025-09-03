import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";
import notificationRoute from "./routes/notification.route.js";
import path from "path";
import cors from "cors";
import chatRoute from "./routes/chat.route.js";
import { Server } from "socket.io";
import http from "http";
import messageRoutes from "./routes/message.route.js";
import adminRoutes from "./routes/admin.route.js";
import helpRoutes from "./routes/help.route.js";
import bookingRoutes from "./routes/booking.route.js";
dotenv.config();
// 🟢 Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Your frontend URL
    credentials: true, // ✅ Allow cookies
  })
);
const server = http.createServer(app);

// ✅ Attach Socket.io to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// ✅ Socket.io logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`User joined room: ${chatId}`);
  });

  socket.on("sendMessage", (msgData) => {
    const { chatId } = msgData;
    // ✅ Broadcast to everyone else in the room
    io.to(chatId).emit("receiveMessage", msgData);
    console.log("📨 Message sent:", msgData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running with socket.io on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/notification", notificationRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/bookings", bookingRoutes);
// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
