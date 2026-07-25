import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    device: {
      type: String,
      default: "Unknown Device",
    },

    browser: {
      type: String,
      default: "Unknown Browser",
    },

    os: {
      type: String,
      default: "Unknown OS",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const sessionModel = mongoose.model("Session", sessionSchema);

export default sessionModel;