const SubCategory =require('../Models/category/subcategory')


exports.getAllSubCategory =async(req,res,next)=>{
    const subcategory =await SubCategory.find({},{categoryId:0,status:0,createdAt:0,updatedAt:0})
    if(!subcategory) return next(new Error('no data is avaible'))
    res.status(200).send(subcategory)
}