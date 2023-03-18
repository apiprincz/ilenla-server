const mongoose = require("mongoose");

// processing, approved

const receiptSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, ref: "User" },
    selectedFiles: {
      type: String,
      required: true,
    },
    merchant: {
      type: String,
      required: true,
      ref: "Merchant",
    },
    merchantName: {
      type: String,
    },
    status: { type: String, default: "processing" },
    point: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("receipt", receiptSchema);
