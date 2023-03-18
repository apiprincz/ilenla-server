const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const cleanBody = require("../middlewares/cleanBody");
const User = require("../models/user");
const mongoose = require("mongoose");
const { sendEmail } = require("../helpers/voucherMailer");

router.post("/", cleanBody, async (req, res) => {
  try {
    const { id, amount_paid_in_point, new_user_point_balance, email } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json("No User with that Id");

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        totalPoint: 12.5,
        point: 12.5,
        redeemDate: Date.now(),
      },
      {
        new: true,
      }
    );

    const order = new Order(req.body);
    let total = await Order.countDocuments();
    total = total + 1;
    order.createdAt = Date.now();
    order.order_ref = `WAZODEAL-${total}`;

    order.userId = id;

    const newOrder = await order.save();
    return res.status(200).json({
      success: true,
      message: "Order submitted Successfully",
      Order: newOrder,
      user: id,
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
