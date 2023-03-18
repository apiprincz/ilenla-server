const mongoose = require("mongoose");

const agentCardSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
   
  },
  agentId: {
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
  deliveryAddress:{
    type: String,
    required: true,
    
  } ,
  deliveryState: {
    type: String,
    required: true,
    
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  payment_method: {
    type: String,
    
  },
  paid:{
    type:Boolean,
    default:false
  }
});

module.exports = mongoose.model("agentcard", agentCardSchema);
