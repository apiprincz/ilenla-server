
const mongoose = require("mongoose");

const buyPointSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
    },
    merchantId: {
        type: String, 
        required: true,
    },
    point: {
        type: Number, 
        required: true,
    },
    
    amount_paid_in_card: {
        type: Number, 
        required: true,
    },
   
    pay_stack_ref: {
        type: String, 
        required: true
    },
  
    orderTotal:{
        type: Number, 
        required: true,
    },
    
    order_ref:{
        type: String, 
        required: true,
    },
    createdAt:{
        type: Date, 
        default:Date.now()
        
    },
    
    payment_method:{
        type:[String],
        default:["card"]
    }
});

module.exports = mongoose.model("buyPoint", buyPointSchema);
