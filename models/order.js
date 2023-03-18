const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  order: {
    type: Array,
    required: true,
  },
  amount_paid_in_card: {
    type: Number,
    required: true,
  },
  amount_paid_in_point: {
    type: Number,
    required: true,
    default: 0,
  },
  pay_stack_ref: {
    type: String,
    required: true,
  },
  pay_stack_ref_id: {
    type: String,
    default: "paid with point",
  },
  orderTotal: {
    type: Number,
    required: true,
  },

  order_ref: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  payment_method: {
    type: [String],
    default: ["card"],
  },
});

module.exports = mongoose.model("order", orderSchema);
