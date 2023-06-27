const mongoose = require("mongoose");
const User =require('../User/UserShema')
const Internship=require('../Internship/Internship')

const TransactionSchema = new mongoose.Schema({
  Transaction_id: {
    type: String,
    required: true,
  },
  Oder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Internship'
  },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["paid", "unpaid"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
