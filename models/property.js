const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    id: { type: String, default: null },
    title: { type: String, default: null },
    description: { type: String, default: null },
    listingNo: { type: String, default: null },
    price: { type: Number, default: null },
    priceTicker: { type: String, default: null },
    location: { type: String, default: null },
    country: { type: String, default: "nigeria" },
    propertyFeatures: { type: [Object], default: [] },
    address: { type: String, default: null },
    files: { type: [Object], default: null },
    rooms: { type: String, default: '-' },
    listing: { type: String, default: null },
    propertyType: { type: String, default: null },
    cityArea: { type: String, default: null },
    plot: { type: String, default: '-' },
    inviteOffers: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    agentId: { type:String },
    percentageCut: { type: Number, default: null },
    verifiedOwner: { type: [Object] },
    viewerCount: { type: [Object] },
    favoriteCount: { type: [Object] },
    agentInfo: { type: Object },
    currency: { type: [String] },
    propertyAmenities: { type: [String] },
    createdAt: {type:Date, default:Date.now()},
    startDate: { type: Date, default: null },
    endDate: { type: Date,default: null },
    ownerHistory: { type: [Object] },
    saleHistory: { type: [Object] },
    offerHistory: { type: [Object] },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("property", propertySchema);
