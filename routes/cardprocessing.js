
const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanBody");

var axios = require('axios');

// url: 'http://154.113.16.142:8088/AppDevAPI/api/PrepaidCardNewCardRequest',

// Base URL: http://154.113.16.138:81/
router.post("/", cleanBody, async (req, res) => {
  console.log('page100', req.body)

    var data = {
      appId: process.env.APP_ID,
      appKey: process.env.APP_KEY,
      bvn: req.body.bvn,
      MeansOfIdNumber: req.body.MeansOfIdNumber,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mobileNr: req.body.phone,
      streetAddress: req.body.deliveryAddress,
      streetAddressLine2: req.body.deliveryState,
      email: req.body.email,
    };
    console.log('page100', data)
    var config = {
      method: 'post',
      url: 'http://154.113.16.138:81/AppDevAPI/api/PrepaidCardNewCardRequest',
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
        success: false,
        error:error
      });
    });

})

module.exports = router;
