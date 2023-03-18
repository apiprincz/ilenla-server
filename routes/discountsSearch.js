const express = require("express");
const router = express.Router();
const Discount = require("../models/discount");
const Merchant = require("../models/merchant");
const cleanBody = require("../middlewares/cleanBody");

router.get("/search", async (req, res) => {
  try {
    let { merchant, category, discount } = req.query;

    const discounts = await Discount.find({
      $or: [
        { categories: { $in: category } },
        { merchant: merchant },
        { discount: discount },
      ],
    });

    res.status(200).json({ discounts: discounts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.patch("/:id", async (req, res) => {
  const { id: _id } = req.params;

  const discount = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No DIscount with that Id");

  const updatedPost = await Discount.findByIdAndUpdate(_id, discount, {
    new: true,
  });

  res.json(updatedPost);
});

router.post("/", cleanBody, async (req, res) => {
  try {
  
    const discount = new Discount({
      title: req.body.title,
      description: req.body.description,
      discount: req.body.discount,
      price: req.body.price,
      point: req.body.point,
      merchant: req.body.merchant,
    });

    saveCover(discount, req.body.cover);

    const newDiscount = await discount.save();
    return res.status(200).json({
      success: true,
      message: "Registration Success",
      discount: newDiscount,
    });

    // return res.redirect("/")
  } catch (error) {
    console.error("signup-error", error);
    return res.json({
      error: true,
      message: "Cannot Register",
    });
  }
});

module.exports = router;
