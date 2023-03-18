const express = require("express");
const router = express.Router();
const BuyPoint = require("../models/buypoint");
const Merchant = require("../models/merchant");
const cleanBody = require("../middlewares/cleanBody");
const User = require("../models/user");
const mongoose = require("mongoose");
const { sendEmail } = require("../helpers/voucherMailer");

router.post("/", cleanBody, async (req, res) => {
  try {
    const {
      id,
      point,
      amount_paid_in_point,
      new_merchant_point_balance,
      email,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json("No Merchant with that Id");

    const updatedMerchant = await Merchant.findByIdAndUpdate(
      id,
      { points: new_merchant_point_balance },
      {
        new: true,
      }
    );

    const merchant = await BuyPoint.find({ merchantId: id }).countDocuments();

    const buyPoint = new BuyPoint(req.body);
    let total = merchant + 1;
    buyPoint.createdAt = Date.now();
    buyPoint.order_ref = `WAZOPOINTS-${total}`;

    buyPoint.merchantId = id;

    const newOrder = await buyPoint.save();
    return res.status(200).json({
      success: true,
      message: `Order for ${point}WP Successful`,
      orderPoint: newOrder,
      merchant: merchant,
    });
  } catch (error) {
    console.error("order-error", error);
    return res.json({
      error: true,
      message: "Cannot Submit Order",
    });
  }
});

module.exports = router;
