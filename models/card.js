const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
   
  },
  userId: {
    type: String,
    required: true,
  },
  amount_paid_in_card: {
    type: Number,
    default:0
  },
  pay_stack_ref: {
    type: String,
    
  },

  firstName: {
    type: String,
    required: true,
   
  },
  lastName: {
    type: String,
    required: true,
   
  },
  phone:{
    type: String,
    required: true,
    
  },
  status: {
    type: String,
   
  },


  createdAt: {
    type: Date,
    default: Date.now,
  },

  payment_method: {
    type: String,
  },
});

module.exports = mongoose.model("card", cardSchema);
