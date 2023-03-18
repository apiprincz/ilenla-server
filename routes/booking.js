const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

const cleanBody = require("../middlewares/cleanBody");
const mongoose = require("mongoose");

const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const fs = require("fs");

router.post("/", async (req, res) => {
  try {
  
    console.log('req',req.body)
    let booking = new Booking({
    
      properties: req.body.properties,
      mode: req.body.mode,
      inspectionDays: req.body.inspectionDays,
      inspectionTime:req.body.inspectionTime,
      email:req.body.email,
      amount_paid: req.body.amount_paid,
      amount_due: req.body.amount_due,
      payment_method: req.body.payment_method,
      payment_status: req.body.payment_status,
      paystack_details: req.body.paystack_details,
      appointmentDays: req.body.appointmentDays,
    
    });
    console.log('booking',booking)

    const newBooking = await booking.save();
    return res.status(200).json({
      success: true,
      message: "Booking Success!!!",
      booking: newBooking,
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

router.get("/", cleanBody, async (req, res) => {
  try {
    const { page } = req.query;

    const LIMIT = 20;
    const startIndex = (Number(page) - 1) * LIMIT;
    // const total = await Booking.countDocuments();

    const properties = await Booking.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    if (!properties) {
      return res.status(400).json({
        error: true,
        message: "No Booking Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All booking.",
        properties: properties,
     
        currentPage: Number(page),
       
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

router.patch("/delete", async (req, res) => {
  const id = req.body;

  // if (!mongoose.Types.ObjectId.isValid(_id))
  //   return res.status(404).json("No Booking with that Id");

    
  // const updatedPost = await Booking.findByIdAndDelete(_id, {
  //   new: true,
  // });
// console.log('req', req.params, _id)
  // return 
  console.log('red', id)

  let objectIdArray = id.map(s => mongoose.Types.ObjectId(s));
  const updatedPost = await Booking.deleteMany( { _id : { $in: objectIdArray } } , {
    new: true,
  });
console.log('reqpost', updatedPost)

  return res.status(200).json({
    success: true,
    message: "Successfully Deleted!!",
  });
});

// router.get("/:id", cleanBody, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const booking = await Booking.findById(id);

//     if (!booking) {
//       return res.status(400).json({
//         error: true,
//         message: "No Propertys Found",
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         message: "Booking Found Succesfully.",
//         booking: booking,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       error: true,
//       message: error.message,
//     });
//   }
// });

// router.patch("/:id", async (req, res) => {
//   const { id: _id } = req.params;

//   const booking = req.body;

//   if (!mongoose.Types.ObjectId.isValid(_id))
//     return res.status(404).json("No DIscount with that Id");

//   const updatedPost = await Booking.findByIdAndUpdate(_id, booking, {
//     new: true,
//   });

//   return res.status(200).json({
//     success: true,
//     message: "Booking updated.",
//     properties: updatedPost,
//   });
// });
// router.patch("/status/:id", async (req, res) => {
//   const { id: _id } = req.params;
//   const { status } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(_id))
//     return res.status(404).json("No Booking with that Id");

//   const updatedPost = await Booking.findByIdAndUpdate(
//     _id,
//     { active: status },
//     {
//       new: true,
//     }
//   );

//   res.json(updatedPost);
// });
// router.patch("/delete/:id", async (req, res) => {
//   const { id: _id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(_id))
//     return res.status(404).json("No Booking with that Id");

//   const updatedPost = await Booking.findByIdAndDelete(_id, {
//     new: true,
//   });

//   return res.status(200).json({
//     success: true,
//     message: "Campaign Deleted!!",
//   });
// });



// router.patch("/campaignImages/:id", async (req, res) => {
//   const { id: _id } = req.params;

//   const { selectedFiles } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(_id))
//     return res.status(404).json("No Booking with that Id");

//   const updatedProperty = await Booking.findByIdAndUpdate(
//     _id,
//     { campaignFiles: selectedFiles },
//     {
//       new: true,
//     }
//   );

//   return res.status(200).json({
//     success: true,
//     message: "Campaign Files Added",
//   });
// });

module.exports = router;
