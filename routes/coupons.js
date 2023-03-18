const express = require("express");
const router = express.Router();
const Coupon = require("../models/coupon");
const User = require("../models/user");
const Merchant = require("../models/merchant");
const cleanBody = require("../middlewares/cleanBody");
const mongoose = require("mongoose");

router.get("/", cleanBody, async (req, res) => {
  try {
    const { page } = req.query;

    const LIMIT = 9;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Coupon.countDocuments();

    const coupons = await Coupon.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    coupons.merchant = mongoose.Types.ObjectId(coupons.merchant);
    if (!coupons) {
      return res.status(400).json({
        error: true,
        message: "No Coupon Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All coupon.",
        coupons: coupons,
        total: total,
        currentPage: Number(page),
        numberOfPages: Math.ceil(total / LIMIT),
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
router.get("/:id", cleanBody, async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(400).json({
        error: true,
        message: "No Coupons Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Coupon Found Succesfully.",
        coupon: coupon,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
router.get("/merchant/:id", cleanBody, async (req, res) => {
  try {
    const { id } = req.params;
    const coupons = await Coupon.find({ merchant: id });
    const statusArr = await Coupon.find(
      { merchant: id },
      { _id: 0, active: true, clicks: true, _id: true }
    );

    if (!coupons) {
      return res.status(400).json({
        error: true,
        message: "No Coupons Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All coupon.",
        coupons: coupons,
        statusArr: statusArr,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  const { id: _id } = req.params;

  const coupon = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No DIscount with that Id");

  const updatedPost = await Coupon.findByIdAndUpdate(_id, coupon, {
    new: true,
  });

  return res.status(200).json({
    success: true,
    message: "All coupon.",
    coupons: updatedPost,
  });
});
router.patch("/delete/:id", async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No Coupon with that Id");

  await Coupon.findByIdAndRemove(_id, {
    new: true,
  });
  return res.status(200).json({
    success: true,
    message: "Campaign Deleted!!",
  });
});
router.patch("/click/:id", async (req, res) => {
  const { id: _id } = req.params;
  const { id, email } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No Coupon with that Id");

  const updatedPost = await Coupon.findByIdAndUpdate(
    _id,
    {
      $push: { clicks: { email: email, userId: id, clickedDate: Date.now() } },
    },
    {
      new: true,
    }
  );

  res.json(updatedPost);
});
router.patch("/status/:id", async (req, res) => {
  const { id: _id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No Discount with that Id");

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    _id,
    { active: status },
    {
      new: true,
    }
  );

  res.json(updatedCoupon);
});
router.post("/", cleanBody, async (req, res) => {
  try {
    const coupon = new Coupon({
      title: req.body.title,
      description: req.body.description,
      categories: req.body.categories,
      discount: req.body.discount,
      point: req.body.point,
      persons: req.body.persons,
      couponcode: req.body.couponcode,
      merchant: req.body.merchant,
      campaignType: req.body.campaignType,
      merchantRef: req.body.merchant,
      selectedFiles: req.body.selectedFiles,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      merchantName: req.body.merchantName,
    });
    const code = Math.floor(Math.random() * 1000000 + 1);

    coupon.code = `WD-${coupon.discount}%OFF-${coupon.title.slice(
      0,
      6
    )}-${code}`;

    let today = new Date();
    if (
      today.getTime() >= new Date(coupon.startDate).getTime() &&
      today.getTime() <= new Date(coupon.endDate).getTime()
    ) {
      coupon.active = true;
    }

    const newCoupon = await coupon.save();
    return res.status(200).json({
      success: true,
      message: "Coupon Campaign Created!! add image",
      coupon: newCoupon,
    });
  } catch (error) {
    console.error("signup-error", error);
    return res.json({
      error: true,
      message: "Cannot Register",
    });
  }
});

router.patch("/campaignImages/:id", async (req, res) => {
  const { id: _id } = req.params;

  const { selectedFiles } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No Coupon with that Id");

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    _id,
    { campaignFiles: selectedFiles },
    {
      new: true,
    }
  );

  return res.status(200).json({
    success: true,
    message: "Campaign Files Added",
  });
});

module.exports = router;
