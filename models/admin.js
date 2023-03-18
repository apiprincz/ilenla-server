const mongoose= require("mongoose")
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    adminId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, default:"admin" },
    role:{type:[String], default:["admin"]},
    active: { type: Boolean, default: false },
    password: { type: String, required: true, default:"123456"},
    passwordText: { type: String},
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    emailToken: { type: String, default: null },
    emailTokenExpires: { type: Date, default: null },
    wallet:{type:Boolean, default:false},
    accessToken: { type: String, default: null },
    photo: { type: String, default: null },
    walletBal:{type:Number, default:0},
    phone:{type:Number, default:null},
   
},
{ timestamps: {createdAt: "createdAt",
updatedAt: "updatedAt",} })


module.exports = mongoose.model("admin", adminSchema)


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