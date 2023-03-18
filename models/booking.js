const mongoose = require("mongoose");



const bookingSchema = new mongoose.Schema({
  email: {
    type: String,
    required:true
  },
  userId: {
    type: String,
  },
  mode: {
    type: String,
    required:true

  },
  
  properties: {
    type: [],
  },
  inspectionDays: {
    type: {},
  },
  appointmentDays: {
    type: {},
  },
  amount_paid_in_card: {
    type: Number,
    default: 0,
  },
  amount_paid: {
    type: Number,
    default: 0,
  },
  amount_due: {
    type: Number,
    default: 0,
  },
  pay_stack_ref: {
    type: String,
  },

  firstName: {
    type: String,
  },
  phone: {
    type: String,
  },
  status: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  inspectionTime: {
    type: String,
  },
  payment_method: {
    type: String,
  },
  payment_status: {
    type: String,
  },
  paystack_details: {
    type: [],
  },
});

module.exports = mongoose.model("booking", bookingSchema);
