const mongoose = require("mongoose");


const discountSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    campaignType: { type: String, required: true, default:'discount' },
    discount: { type: Number, default: 20, required: true },
    price: { type: Number, required: true },
    point: { type: Number, default: 10 },
    categories: {
      type: [String], 
    },
    startDate:{type:Date, default:Date.now()},
    endDate:{type:Date},
    selectedFiles: {
      type: String,
      required: true,
      
    },
    campaignFiles:[],
    merchant: {
      type: String,
      required: true,
      ref: "Merchant",
    },
    productId: {
      type: String,
    },
    merchantRef: { type: mongoose.Types.ObjectId, ref: 'Merchant' },
    qty:{type:Number, default:1},
    persons:{type:Number, default:null},
    active:{type:Boolean, default:false},
    amountsold:{type:Number, default:0}, 
    otherDetails:[]
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

discountSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});
module.exports = mongoose.model("discount", discountSchema);
