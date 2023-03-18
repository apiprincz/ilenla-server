const mongoose = require("mongoose");


const merchantReceiptSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    campaignType: { type: String, required: true, default: "receipt" },
    discount: { type: Number, default: 20, required: true },
    price: { type: Number, required: true },
    point: { type: Number, default: 10 },
    categories: {
      type: [String],
    },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date },
    selectedFiles: {
      type: String,
      required: true,
    },
    campaignFiles: [],
    merchant: {
      type: String,
      required: true,
      ref: "Merchant",
    },
    productId: {
      type: String,
    },
    merchantRef: { type: mongoose.Types.ObjectId, ref: "Merchant" },
    qty: { type: Number, default: 1 },
    persons: { type: Number, default: null },
    active: { type: Boolean, default: false },
    amountsold: { type: Number, default: 0 },
    otherDetails: [],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("merchantReceipt", merchantReceiptSchema);
