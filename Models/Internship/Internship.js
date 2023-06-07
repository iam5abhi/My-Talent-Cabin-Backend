const mongoose = require("mongoose");
const Company =require('../../Models/Company/CompanySchema')
const Subcategory =require('../../Models/category/subcategory')

const InternshipSchema = new mongoose.Schema(
  {
    CompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Company,
      required: [true, "Company id is required"],
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    intershipWeek:{
        type: String,
        require: true,
    },
    intershipType:{
        type:String,
        enum:['paid','unpaid'],
        default:'unpaid'
    },
    price:{
       type:Number,
    },
    tags: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Subcategory,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["approved", "rejected", "pending", "inactive", "complete"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Internships = new mongoose.model("Internships", InternshipSchema);

module.exports = Internships;