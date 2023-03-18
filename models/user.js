const mongoose= require("mongoose")
const bcrypt = require("bcryptjs");



const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    location: { type: String },
    area: { type: String },
    company: { type: String },
    address: { type: String },
    bio: { type: String },
    phone: { type: Number },
    profilePhoto: { type: Object, default: null },
    profileBanner: { type: Object, default: null },
    socialHandle: { type: Object, default: null },
    role:{type:[String], default:["user"]},
    active: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    passwordText: { type: String,  },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    emailToken: { type: String, default: null },
    emailTokenExpires: { type: Date, default: null },
    accessToken: { type: String, default: null },
    
 

},
{ timestamps: {createdAt: "createdAt",
updatedAt: "updatedAt",} })


module.exports = mongoose.model("user", userSchema)


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