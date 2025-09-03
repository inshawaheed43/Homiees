import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["tenant", "landlord", "admin"],
      default: "Landlord",
      required: true,
    },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    city: { type: String, require: true },
    state: { type: String, require: true },
    country: { type: String, require: true },
    address: { type: String, require: true },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
  type: Boolean,
  default: false,
},
isManuallyVerified: {
  type: Boolean,
  default: false,
},
savedListings: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing"
  }
],

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
