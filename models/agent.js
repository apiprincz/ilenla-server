const mongoose= require("mongoose")
const bcrypt = require("bcryptjs");

const agentSchema = new mongoose.Schema({
    agentId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    address: { type: String, required: true },
    role:{type:[String], default:["agent"]},
    active: { type: Boolean, default: false },
    password: { type: String, required: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    emailToken: { type: String, default: null },
    emailTokenExpires: { type: Date, default: null },
    accessToken: { type: String, default: null },
    point:{type:Number, default:12.5},
    earnings:{type:Number, default:0},
    totalPoint:{type:Number, default:12.5},
    wallet:{type:Boolean, default:false},
    walletBal:{type:Number, default:0},
    phone:{type:Number, default:null},
    redeemDate:{type:Date, default:null},


},
{ timestamps: {createdAt: "createdAt",
updatedAt: "updatedAt",} })


module.exports = mongoose.model("agent", agentSchema)


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