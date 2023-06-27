const mongoose = require("mongoose");
const User =require('../User/UserShema')
const Internship=require('../Internship/Internship')

const PaymentDetailsSchema = mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Oder_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Internship'
    },
    razorpayDetails: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    success: Boolean,
  });
  const PaymentDetailsWithRazorPay = mongoose.model('PaymentDetailsWithRazorPay', PaymentDetailsSchema);


  module.exports=PaymentDetailsWithRazorPay