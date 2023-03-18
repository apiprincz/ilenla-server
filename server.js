const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(bodyParser.json({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(express.urlencoded({ extended: false , limit:'50mb'}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

//For ilenla ROutes
const propertyRoute = require("./routes/property");
const userRoute = require("./routes/user");
const bookingRoute = require("./routes/booking");
const adminRoute = require("./routes/admin");



const loginRoute = require("./routes/login");
const indexRoute = require("./routes/index");
const registerRoute = require("./routes/register");


// const couponRoute = require("./routes/coupons");
// const discountSearchRoute = require("./routes/discountsSearch");
// const merchantRoute = require("./routes/merchant");
// const activateRoute = require("./routes/activate");
// const forgotRoute = require("./routes/forgot");
// const referredRoute = require("./routes/referred");
// const logoutRoute = require("./routes/logout");
// const userRoute = require("./routes/user");
// const resetRoute = require("./routes/reset");
// const receiptRoute = require("./routes/receipts");
// const orderRoute = require("./routes/order");
// const buypointRoute = require("./routes/buypoint");
// const cardRoute = require("./routes/card");
// const cardProcessingRoute = require("./routes/cardprocessing");
// const agentRoute = require("./routes/agent");
// const sudoRoute = require("./routes/sudocustomer");



require("dotenv").config();



var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
  methods: "GET, PUT, POST, PATCH, DELETE, OPTIONS",
  accessAllowOrigin:"*",
}
app.use(cors(corsOptions));

//For Ilenla Routes
app.use("/property", propertyRoute);
app.use("/booking", bookingRoute);
app.use("/user", userRoute);



// app.use("/register", registerRoute);
// app.use("/discountsSearch", discountSearchRoute);
// app.use("/coupons", couponRoute);
// app.use("/receipts", receiptRoute);
// app.use("/merchant", merchantRoute);
// app.use("/admin", adminRoute);
// app.use("/forgot", forgotRoute);
// app.use("/activate", activateRoute);
// app.use("/login", loginRoute);
// app.use("/referred", referredRoute);
// app.use("/logout", logoutRoute);
// app.use("/user", userRoute);
// app.use("/reset", resetRoute);
// app.use("/order", orderRoute);
// app.use("/card", cardRoute);
// app.use("/cardprocessing", cardProcessingRoute);
// app.use("/agent", agentRoute);
// app.use("/buypoint", buypointRoute);
// app.use("/customers", sudoRoute);


app.use("/", indexRoute);
app.use(express.static("client/build"));





app.listen(process.env.PORT || 5000);


mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true }, () => {
  console.log("connected");
});
