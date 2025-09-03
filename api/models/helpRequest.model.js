// models/helpRequest.model.js
import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["tenant", "landlord"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    category: {
  type: String,
  required: false,
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('HelpRequest', helpRequestSchema);
