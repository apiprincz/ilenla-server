const express = require("express");
const router = express.Router();
const Property = require("../models/property");

const cleanBody = require("../middlewares/cleanBody");
const mongoose = require("mongoose");

const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const fs = require("fs");

router.post("/", upload.array("image", 5), async (req, res) => {
  try {
  
    console.log('req',req.body)

    const uploader = async (path) => await cloudinary.uploads(path, "Images");
    let urls = [];

    if (req.method === "POST") {
      const files = req.files;
    console.log('req',req, files)

      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
     
        let newObject = {
          secure_url: newPath.secure_url,
          cloudinary_id: newPath.public_id,
        };
        urls.push(newObject);
        console.log("a", urls);

        fs.unlinkSync(path);
      }
    }

  
    let property = new Property({
      files: urls,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location:req.body.location,
      features:JSON.parse(req.body.features),
      address: req.body.address,
      rooms: req.body.rooms,
      amenities: JSON.parse(req.body.amenities),
      listing: req.body.listing,
      type: req.body.type,
      plot: req.body.plot,
      inviteOffers: req.body.inviteOffers,
      status: req.body.status,
      assignedRealtor:req.body.assignedRealtor,
      percentageCut: req.body.percentageCut,
      verifiedOwner: req.body.verifiedOwner,
      currency: req.body.currency,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
    console.log('property',property)

    const newProperty = await property.save();
    return res.status(200).json({
      success: true,
      message: "New Property Added!!!",
      property: newProperty,
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
    // const total = await Property.countDocuments();

    // const properties = await Property.find()
    //   .sort({ _id: -1 })
    //   .limit(LIMIT)
    //   .skip(startIndex);

    const properties = await Property.find({active:true})
      .sort({ _id: -1 })
      

    if (!properties) {
      return res.status(400).json({
        error: true,
        message: "No Property Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All property.",
        properties: properties,
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
  //   return res.status(404).json("No Property with that Id");

    
  // const updatedPost = await Property.findByIdAndDelete(_id, {
  //   new: true,
  // });
// console.log('req', req.params, _id)
  // return 
  console.log('red', id)

  let objectIdArray = id.map(s => mongoose.Types.ObjectId(s));
  const updatedPost = await Property.deleteMany( { _id : { $in: objectIdArray } } , {
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
//     const property = await Property.findById(id);

//     if (!property) {
//       return res.status(400).json({
//         error: true,
//         message: "No Propertys Found",
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         message: "Property Found Succesfully.",
//         property: property,
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

//   const property = req.body;

//   if (!mongoose.Types.ObjectId.isValid(_id))
//     return res.status(404).json("No DIscount with that Id");

//   const updatedPost = await Property.findByIdAndUpdate(_id, property, {
//     new: true,
//   });

//   return res.status(200).json({
//     success: true,
//     message: "Property updated.",
//     properties: updatedPost,
//   });
// });
// router.patch("/status/:id", async (req, res) => {
//   const { id: _id } = req.params;
//   const { status } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(_id))
//     return res.status(404).json("No Property with that Id");

//   const updatedPost = await Property.findByIdAndUpdate(
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
//     return res.status(404).json("No Property with that Id");

//   const updatedPost = await Property.findByIdAndDelete(_id, {
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
//     return res.status(404).json("No Property with that Id");

//   const updatedProperty = await Property.findByIdAndUpdate(
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
