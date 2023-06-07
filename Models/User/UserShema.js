const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SubCategory =require('../../Models/category/category')
 
 

 
const UserSchema = new mongoose.Schema(
 {
   name: {
     type: String,
     required: true,
     lowercase: true,
     trim: true,  
     minLength: 2,
     match:[
       /^[a-zA-Z ]{2,30}$/,
       "please fill a valid firstName"
     ]
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
        type:String
   },
   language:[],
   avatar: {
     type: String,
     default:"https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"
   },
   education:[{
      degreeName:String,
      collegeName:String,
      startDate:String,
      endDate:String
   }],
   skills: [{
      type:mongoose.Schema.Types.ObjectId,
      ref:SubCategory
   }],
   experience:[{
     position:String,
     company:String,
     startDate:String,
     endDate:String
   }],
   bio: {
     type: String,
     minLength: 8,
     maxLength: 500,
     match:[
       /^[a-zA-Z0-9_\.\-]{8,500}$/,
       "please fill a valid firstName"
     ]
   },
   Certification:[String],
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
   status:{
     type:String,
     required:true,
     enum:['pending','onload','created','terminate'],
     default:'onload'
   }
 },
 
);
 
UserSchema.pre("save", async function (next) {
 if (!this.isModified("password")) {
   return next();
 }
 const salt = await bcrypt.genSalt();
 const hashed = await bcrypt.hash(this.password, salt);
 
 this.password = hashed;
 this.confirmPassword = undefined;
});
 
 
UserSchema.methods.comparepassword=async function(password){
 return await bcrypt.compare(password,this.password)
}
 
 
const User = mongoose.model("User", UserSchema);
 
module.exports=User