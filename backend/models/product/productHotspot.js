import mongoose from "mongoose";

const productHotspotSchema = new mongoose.Schema(
  {
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    position: {
      x: {
        type: Number,
        required: true,
      },

      y: {
        type: Number,
        required: true,
      },

      z: {
        type: Number,
        required: true,
      },
    },

    icon: {
      type: String,
      enum: [
        "pin",
        "plus",
        "info",
        "star",
        "circle",
      ],
      default: "pin",
    },

    color: {
      type: String,
      default: "#ff0000",
    },

    isVisible: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ProductHotspot",
  productHotspotSchema
);