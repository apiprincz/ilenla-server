const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const Merchant = require("../models/merchant");
const cleanBody = require("../middlewares/cleanBody");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const fs = require("fs");
// const User = require("../model/user");

router.post("/", upload.array("image", 5), async (req, res) => {
  try {
    // Upload image to cloudinary
    // const result = await cloudinary.uploader.upload(req.files);

    const uploader = async (path) => await cloudinary.uploads(path, "Images");


    let urls = [];

    if (req.method === "POST") {
      const files = req.files;
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
    console.log('a', urls);

    // console.log('aoutside', a);

    return;
    // Create new user
    let user = new User({
      name: req.body.name,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    });
    // Save user
    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", cleanBody, async (req, res) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(req.imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
});

router.get("/", cleanBody, async (req, res) => {
  try {
    const admin = await Admin.find().sort({ _id: -1 });

    if (!admin) {
      return res.status(400).json({
        error: true,

        message: "No Discount Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All admins.",
        admin: admin,
      });
    }
  } catch (error) {
    //   console.error("Discount-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}) /
  router.post("/", cleanBody, async (req, res) => {
    try {
      const { email } = req.body;

      const admin = await Admin.findOne({ email: email });

      if (admin) {
        return res.json({
          success: true,
          msg: "admin already exist",
        });
      }

      const newAdmin = new Admin({
        title: req.body.title,
        description: req.body.description,
        admin: req.body.admin,
        price: req.body.price,
        point: req.body.point,
        admin: req.body.admin,
      });

      const SavedAdmin = await newAdmin.save();
      return res.status(200).json({
        success: true,
        message: "Registration Success",
        admin: savedAdmin,
      });
    } catch (error) {
      console.error("signup-error", error);
      return res.json({
        error: true,
        message: "Cannot Register",
      });
    }
  });

router.post("/signup", cleanBody, async (req, res) => {
  try {
    const admin = new Admin({
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      name: req.body.name,
    });

    // Check if admin email exist

    const existingUser = await Admin.findOne({ email: admin.email });

    if (existingUser) {
      return res.status(201).json({
        message: "This Email is registered",
        error: true,
      });
    }

    const hash = await Admin.hashPassword(admin.password);

    const id = uuid(); //Generate unique id for the admin.

    admin.adminId = id;
    admin.passwordText = admin.password;
    admin.password = hash;

    const newAdmin = new Admin(admin);
    await newAdmin.save();
    return res.status(200).json({
      success: true,
      message: "New Admin Created!",
      admin: newAdmin,
    });
  } catch (error) {
    //   console.error("admin-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

router.post("/merchant/signup", cleanBody, async (req, res) => {
  try {
    const merchant = new Merchant({
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      merchantName: req.body.merchantName,
      address: req.body.address,
      category: req.body.category,
      discount: req.body.discount,
      description: req.body.description,
      logo: req.body.logo,
    });

    const hashedpassword = await Merchant.hashPassword(merchant.password);

    merchant.password = hashedpassword;

    const id = uuid(); //Generate unique id for the merchant.

    merchant.merchantId = id;

    const newMerchant = new Merchant(merchant);
    await newMerchant.save();
    return res.status(200).json({
      success: true,
      message: "New Merchant Created Successfully",
      merchant: newMerchant,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "can't register new merchant",
    });
  }
});

router.patch("/:id", async (req, res) => {
  const { id: _id } = req.params;
  const { password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No Admin with that Id");

  const hashedpassword = await Admin.hashPassword(password);

  const updatedAdmin = await Admin.findByIdAndUpdate(
    _id,
    { password: hashedpassword, selectedFiles },
    {
      new: true,
    }
  );

  const token = jwt.sign(
    { email: updatedAdmin.email, id: updatedAdmin._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    success: true,
    message: "Password Succesfully updated",
    admin: updatedAdmin,
    token,
  });
});

router.patch("/delete/:id", async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No Discount with that Id");

  await Admin.findByIdAndRemove(_id, {
    new: true,
  });
});
router.patch("/merchant/:id", async (req, res) => {
  const { id: _id } = req.params;

  const merchant = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No Merchant with that Id");

  const updatedMerchant = await Merchant.findByIdAndUpdate(_id, merchant, {
    new: true,
  });

  return res.status(200).json({
    success: true,
    message: "Merchant Updated Succesfully",
    merchant: updatedMerchant,
  });
});
router.patch("/merchantLogo/:id", async (req, res) => {
  const { id: _id } = req.params;

  const { selectedFiles } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No Merchant with that Id");

  const updatedMerchant = await Merchant.findByIdAndUpdate(
    _id,
    { logo: selectedFiles },
    {
      new: true,
    }
  );

  return res.status(200).json({
    success: true,
    message: "Logo updated",
    merchant: updatedMerchant,
  });
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin email exist

    const admin = await Admin.findOne({ email: email });

    if (!admin) {
      return res.status(201).json({
        message: "This Email does not exist",
        error: true,
      });
    }

    //3. Verify the password is valid
    const isValid = await Admin.comparePasswords(password, admin.password);

    if (!isValid) {
      return res.status(201).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { email: admin.email, id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    admin.accessToken = token;

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      admin: admin,
      token,
    });
  } catch (error) {
    //   console.error("admin-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
module.exports = router;
