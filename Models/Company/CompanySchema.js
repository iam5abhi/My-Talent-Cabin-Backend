const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



const CompanySchema =new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,   
        minLength: 2,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/,
          "Please fill a valid email address",
        ],
    },
   
   PhoneNumber: {
        type: Number,
        required: true,
        min: 10,
        match:[
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
          "Please Fill the valid Phone Number"
        ]
      },
      
      location:{
        type:String,
        required:true
      },  
      GSTIN:{
          type:String
    },
    address:{
      type:String,
    },
    description:{
        type:String,
        minLength: 2,
        match:[
            /^[a-zA-Z ]{2,30}$/,
            "please fill a valid firstName"
          ]
    },
    bio:{
       type:String
    },
    video_url:{
      type:String
    },
    avatar: {
        type: String,
        default:"https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"
      },
    linkedin_url:{
        type:String
       },
    hr:[
        {
            image:{
                type:String,
                default:"https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"
            },
            name:{
                type: String,
                required: true,
                lowercase: true,
                trim: true,   
                minLength: 2,
            },
            designation:{
                type: String,
                lowercase: true,
            }
        },
    ],
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 500
    },
    confirmPassword: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 500,
      validate: function () {
        return this.confirmPassword === this.password;
      }
    },
    isAccountVerified: {
        type: Boolean,
        default: true,
      },
      accountCreated: {
        type: Date,
        default: Date.now,
    },
      
})



CompanySchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(this.password, salt);
  
    this.password = hashed;
    this.confirmPassword = undefined;
  });


  CompanySchema.methods.comparepassword=async function(password){
    return await bcrypt.compare(password,this.password)
  }


  const Company =mongoose.model("Company", CompanySchema);


 module.exports=Company