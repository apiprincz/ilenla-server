const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Discount = require("./discount");


const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true},
  role: {type:String, default:"Admin"},
  name:String,
  status: {
    type: String},
  password: {
    type: String,
    required: true,
    default: "1234567"}
})

const merchantSchema = new mongoose.Schema(
  {
    email: { type: String },
    merchantId: { type: String, required: true, unique: true },
    merchantName: { type: String, required: true },
    address: { type: String, required: true },
    category: {
      type: [String],  
    },
    role:{type:[String], default:["merchant"]},
    discount: { type: Number },
    phone: { type: Number, required: true},
    description: { type: String, required: true  },
    price: { type: Number},
    logo: { type: Array },
    merchantCode: { type: String },
    users:[userSchema],
    discounts: [{ type: mongoose.Types.ObjectId, ref: 'Discount' }],
    password: {
      type: String,
      required: true,
      default: function () {
        return Math.floor(Math.random() * 900000000) + 100000000;
      },
    },
    wallet:{type:Boolean, default:false},
    walletBal:{type:Number, default:0},
    active:{type:Boolean, default:false},
    points:{type:Number, default:0},
    pointForClicks:{type:Number, default:0},
    otherDetails:[]
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);



merchantSchema.pre("remove", function (next) {
  Discount.find({ merchant: this.id }, (err, discounts) => {
    if (err) {
      next(err);
    } else if (discounts.length > 0) {
      next(new Error("This merchant has discounts still"));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Merchant", merchantSchema);

module.exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Hashing failed", error);
  }
};
module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    throw new Error("Comparison failed", error);
  }
};
