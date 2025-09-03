// models/chat.model.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  // members: {
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: "User",
  //   required: true, // tenant and landlord
  // },
  lastRead: {
  type: Map, // Key: userId, Value: timestamp
  of: Date,
  default: {},
},
participants: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
   required: true,
}]


}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
