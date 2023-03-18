const express = require("express");
const router = express.Router();
const Card = require("../models/card");
const cleanBody = require("../middlewares/cleanBody");
const User = require("../models/user");
const mongoose = require("mongoose");
const CardAgent = require("../models/agentcard");
var axios = require('axios');


const { sendEmail } = require("../helpers/voucherMailer");

router.get("/", cleanBody, async (req, res) => {
  try {
    const { page } = req.query;

    const LIMIT = 9;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Card.countDocuments();

    const vouchers = await Card.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
 

    if (!vouchers) {
      return res.status(400).json({
        error: true,
        message: "No Voucher Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All Vouchers.",
        vouchers: vouchers,
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
router.get("/cards", cleanBody, async (req, res) => {
  try {
    const { page } = req.query;

    const LIMIT = 9;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await CardAgent.countDocuments();

    const cards = await CardAgent.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
 

    if (!cards) {
      return res.status(400).json({
        error: true,
        message: "No Cards Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All Cards.",
        cards: cards,
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
    const card = await Card.find({ userId: id });
   

    if (!card) {
      return res.status(400).json({
        error: true,
        message: "No card Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "card.",
        card:card
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});


router.post("/", cleanBody, async (req, res) => {
  try {
    
    console.log("reqbody", req.body)
    const card = new Card(req.body);
    const cardOne = await Card.findOne({ email: card.email });
    console.log('cardOne', cardOne)
  
  if(cardOne) {
    return res.status(200).json({
      error:true,
      message: "This Email Already Have A Card",
      
    });
  } else {
    const newCard = await card.save();
    console.log("newCard", newCard)
    return res.status(200).json({
      success: true,
      message: "Success",
      card: newCard,
    });
  }
  
  } catch (error) {
    console.error("order-error", error);
    return res.json({
      error: true,
      message: "Cannot Submit Order",
    });
  }
});

router.post("/virtual", cleanBody, async (req, res) => {
 
  var data = req.body
  var config = {
    method: 'post',
    url: 'http://154.113.16.142:8088/AppDevAPI/api/PrepaidCardCreateCard',
    headers: { },
    data : data
  };
  console.log("body",data)
  axios(config)
  .then(function (response) {
    console.log('newcard',JSON.stringify(response.data));
    return res.status(200).json({
      success: true,
      data:response.data,
    });
  })
  .catch(function (error) {
    console.log(error);
    return res.status(200).json({
      
      error:error
    });
  });

})

router.patch("/:id", async (req, res) => {
  const { id: _id } = req.params;

  console.log(req.body)
  let card = req.body;
  card.status = 'processing'

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("Make Payment before proceeding");

  const updatedCard = await Card.findOneAndUpdate({userId:_id},card, {
    new: true,
  });
  console.log("updatedCard", updatedCard)
  
  console.log("updatedCard", _id)

  return res.status(200).json({
    success: true,
    message: "Card Application Success!!",
    card: updatedCard,
  });
});
module.exports = router;
