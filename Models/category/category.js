const mongoose = require('mongoose');

const catSchema= new mongoose.Schema({
    title: { type: String, required: true },
    status:{type:String,enum:['active','deactive'],default:"active"},
})

const Category = new mongoose.model("Category", catSchema);

module.exports = Category;