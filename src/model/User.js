import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 14,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  firstName: {
    type: String,
    required: true,
    max: 14,
    min: 3,
  },
  lastName: {
    type: String,
    required: true,
    max: 14,
    min: 3,
  },
  bio: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "basic",
    enum: ["basic", "admin", "superAdmin"],
  },
  imageUrl: {
    type: String,
    default: null,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
  ],
  passwordResetToken: String,
  passwordResetExpires: Date,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
