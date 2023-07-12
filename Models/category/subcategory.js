const mongoose = require('mongoose');
const Category=require('./category')


const subcategorySchema = new mongoose.Schema({
   categoryId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:Category,
    require:true
   }, 
    name: {
      type: String,
    },
    status:{
      type:String,
      enum:['enable','disable'],
      default:'enable'
    }
},{timestamps:true});


const SubCategory =mongoose.model('SubCategory',subcategorySchema)

module.exports=SubCategory