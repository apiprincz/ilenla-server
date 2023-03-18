const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { generateJwt } = require("../helpers/generateJwt");
const cleanBody = require("../middlewares/cleanBody");

router.patch("/", cleanBody, async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.json({
        error: true,
        status: 400,
        message: "Please make a valid request",
      });
    }
    const user = await User.findOne({
      email: email,
      emailToken: code,
      emailTokenExpires: { $gt: Date.now() },
    });

    console.log("======activateuser======")
    console.log(user)
    console.log(user.active)
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid details",
      });
    } else {
      if (user.active)
        return res.send({
          error: true,
          message: "Account already activated",
          status: 400,
        });

      const { error, token } = await generateJwt(user.email, user.userId);
      if (error) {
        return res.status(500).json({
          error: true,
          message: "Couldn't create access token. Please try again later",
        });
      }

      user.emailToken = "";
      user.emailTokenExpires = null;
      user.active = true;
      user.accessToken = token;

      let referrer= await User.findOne({
        referralCode: user.referrer,
      });

      if(referrer) {
        if (referrer.active === true) {
          let referedUser = await User.updateOne(
            { referralCode: user.referrer },
            {
              $push: {
                referrals: {
                  email: user.email,
                  id: user._id,
                  signupDate: Date.now(),
                  point: 12.5,
                },
              },
            }
          );
  
          
        } else {
            console.log("ot active")
        }
      }
      

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Account activated.",
        token: user.accessToken,
        user: user,
      });
    }
  } catch (error) {
    console.error("activation-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

module.exports = router;
