var axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/", cleanBody, async (req, res) => {
  try {
    var config = {
      method: "get",
      url: `https://api.geoapify.com/v1/geocode/autocomplete?text=${req.location}&apiKey=10f75f02c9f34b809bed90f4d1e53698`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    return res.send({
      success: true,
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({
      error: true,
    });
  }
});

module.exports = router;
