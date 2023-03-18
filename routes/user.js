const express = require("express");
const cleanBody = require("../middlewares/cleanBody");
const router = express.Router();
const User = require("../models/user");
const { validateToken } = require("../middlewares/validateToken");
const { v4: uuid } = require("uuid");
const { sendEmail } = require("../helpers/mailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { customAlphabet: generate } = require("nanoid");
const mongoose = require("mongoose");

// Generate Referral Code for new user
const CHARACTER_SET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const REFERRAL_CODE_LENGTH = 8;
const referralCode = generate(CHARACTER_SET, REFERRAL_CODE_LENGTH);

router.get("/", cleanBody, async (req, res) => {
  try {
    const users = await User.find( {verified:true},{ passwordText: 0, password: 0 } );

    if (!users) {
      return res.status(400).json({
        error: true,
        message: "No user Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All users.",
        agents: users,
      });
    }
  } catch (error) {
    //   console.error("user-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
router.get("/:id", cleanBody, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id,  { passwordText: 0, password: 0 } );
   

    if (!user) {
      return res.status(400).json({
        error: true,

        message: "No user Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "agent",
        agent: user,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user email exist

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(201).json({
        message: "This Email does not exist",
        error: true,
      });
    }

    //3. Verify the password is valid
    const isValid = await User.comparePasswords(password, user.password);

    if (!isValid) {
      return res.status(201).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    user.accessToken = token;

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: user,
      token,
    });
  } catch (error) {
    //   console.error("user-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
router.post("/signup", cleanBody, async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
  
    });

    // Check if user email exist

    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      return res.status(201).json({
        message: "This Email is registered",
        error: true,
      });
    }

    // check if password is entered correctly
    const check = user.password === req.body.confirmPassword;

    if (!check) {
      return res.status(201).json({
        message: "Password does not match",
        error: true,
      });
    }

    const hash = await User.hashPassword(user.password);

    const id = uuid(); //Generate unique id for the user.

    user.userId = id;
    delete user.confirmPassword;
    user.password = hash;


    let code = Math.floor(1000000 + Math.random() * 900000); // Generate code for sending email

    let expiry = Date.now() + 60 * 1000 * 15; //15 mins in ms

    // const sendCode = await sendEmail(user.email, code);

    // if (sendCode.error) {
    //   return res.status(500).json({
    //     error: true,
    //     message: "Couldn't send verification email.",
    //   });
    // }
    user.emailToken = code;
    user.emailTokenExpires = new Date(expiry);

  


   
    const newUser = new User(user);
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "Signup Success!",
      email: user.email,
      user:user
    });
  } catch (error) {
    //   console.error("user-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
router.patch("/:id", async (req, res) => {
  const { id: _id } = req.params;
  const { phone, email } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No User with that Id");

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { phone: phone },
    {
      new: true,
    }
  );
  const user = await User.findById(_id);

  return res.status(200).json({
    success: true,
    message: "profile updated Successful",
    user: updatedUser,
    token: user.accessToken,
  });
});
router.patch("/point/:id", async (req, res) => {
  const { id: _id } = req.params;

  const { totalPoint } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No User with that Id");

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { totalPoint: totalPoint },
    {
      new: true,
    }
  );


  return res.status(200).json({
    success: true,
    message: "profile updated Successful",
    user: updatedUser,
  });
});

module.exports = router;
