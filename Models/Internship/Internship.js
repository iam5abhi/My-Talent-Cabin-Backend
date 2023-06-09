const mongoose = require("mongoose");
const Company =require('../../Models/Company/CompanySchema')
const Subcategory =require('../../Models/category/subcategory')
const Mentor =require('../Mentor/MentorSchema')
const User =require('../User/UserShema')

const InternshipSchema = new mongoose.Schema(
  {
    CompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Company,
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
    mentorId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Mentor'
    },
    enrollStudent:[
      {
        studentId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        },
        projectUserdesciption:{
            type:String
        }
      }
    ],
    tags: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Subcategory,
        },
      },
    ],
    meetingLink:{
      type: String,
      required: true,
    },
    number_of_opening: {
      type: String,
      required: true,
    },
    selling:{
      type:String,
      enum:['hot']

    },
    startDate:{
      type:Date,
    },
    endtDate:{
      type:Date,
    },
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