const { validationResult } = require("express-validator");
const base64 = require("base-64");

const Admin = require('../../Models/Admin/admin')
const Error = require("../../Utils/ErrorHandler/ErrorHandler");
const CatchAsyncHandler = require('../../Middleware/Error/CatchAsyncHandler')
const createSendToken = require("../../suscribers/createSendToken");
const Category =require('../../Models/category/category')
const { REGISTRATION_SUCCESS, PASSWORD_NOT_MATCH, COMPARE_PASSWORD_USING_DB, LOGIN_SUCCESS, USER_ALREADY_EXIST } = require('../../ConstandMessage/Message')
const FactoryHandler =require('../../FactoryHandler/factoryhandler')
const SubCategory =require('../../Models/category/subcategory')
const Internships =require('../../Models/Internship/Internship')
const User =require('../../Models/User/UserShema')
const Company =require('../../Models/Company/CompanySchema')


exports.signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() });
        const { username, email, password, confirmPassword } = req.body;
        console.log(username, email, password, confirmPassword)
        if (base64.decode(password) !== base64.decode(confirmPassword)) return next(new Error(PASSWORD_NOT_MATCH, 400));
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return next(new Error(USER_ALREADY_EXIST, 400));
        const newAdmin = new Admin({ username, email, password:base64.decode(password), confirmPassword:base64.decode(confirmPassword)});
        const savedAdmin = await newAdmin.save();
        res.status(200).send({
            message: REGISTRATION_SUCCESS,
            success: true,
            name: savedAdmin.name,
            email: savedAdmin.email,
        });
    } catch (err) {
        next(new Error(`${err}`, 500))
    }
}


exports.login = async (req, res, next) => {
    try {
        const password = base64.decode(req.body.password);
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() });

        const user = await Admin.findOne({ email: req.body.email }, {createdAt: 0 })
        if (!user) return next(new Error(COMPARE_PASSWORD_USING_DB, 400));

        const isMatch = await user.comparepassword(password);
        if (!isMatch) return next(new Error(COMPARE_PASSWORD_USING_DB, 400));
        createSendToken(user, 200, req, res, LOGIN_SUCCESS);
    } catch (error) {
        next(new Error(`${error}`, 500))
    }
}


exports.update_password =FactoryHandler.UpdatePasswordHandler(Admin)



//Category Handler
exports.addcategory=FactoryHandler.Add(Category)
exports.getallcategory=FactoryHandler.getAll(Category)
exports.editcategory=FactoryHandler.updateOne(Category)
exports.updatestatus=FactoryHandler.updateOne(Category)
exports.getcategory=FactoryHandler.getOne(Category)



exports.AddSubCategory =async(req,res,next)=>{
    const data =await SubCategory.create({
        categoryId:req.body.categoryId,
        name:req.body.name
    })
    if(!data) return next(new Error('no added',500))
    res.status(201).send(data)
}



exports.GetOneSubCategory =async(req,res,next)=>{
  const data =await SubCategory.findOne({_id:req.params.id})
  if(!data) return next(new Error('no added',500))
  res.status(201).send(data)
}


exports.GetAllSubCategory = async(req,res,next)=>{
  const data =await SubCategory.find({categoryId:req.params.id})
  if(!data) return next(new Error('no added',500))
  res.status(201).send(data)
}


exports.UpdateSubCategory  =async(req,res,next)=>{
  const data = await SubCategory.updateOne({_id:req.params.id},{$set:{name:req.body.name}})
  if(!data) return next(new Error('no added',500))
 res.status(201).send(data)
}


exports.UpdateSubCategoryStatus  =async(req,res,next)=>{
    const data = await SubCategory.updateOne({_id:req.params.id},{$set:{status:req.body.status}})
    if(!data) return next(new Error('no added',500))
   res.status(201).send(data)
  }
  



exports.AddInternships =async(req,res,next)=>{
    const data = await Internships.create({
        CompanyId:req.body.CompanyId,
        title:req.body.title,
        description:req.body.description,
        intershipWeek:req.body.intershipWeek,
        intershipType:req.body.intershipType,
        price:req.body.price,
        tags:req.body.tags
    })
    if(!data) return next(new Error('no added',500))
    res.status(201).send(data)
  }
  
  
  exports.GetAllInternships  =async(req,res,next)=>{
    const data = await Internships.find({})
    if(!data) return next(new Error('no added',500))
    res.status(201).send(data)
  }
  
  
  exports.GetOneInternships =async(req,res,next)=>{
    const data = await Internships.findOne({_id:req.params.id})
    if(!data) return next(new Error('no added',500))
    res.status(201).send(data)
  }
  
  
  
  exports.updateIntership =async(req,res,next)=>{
   const updatedData={
    title:req.body.title,
    description:req.body.description,
    intershipWeek:req.body.intershipWeek,
    intershipType:req.body.intershipType,
    price:req.body.price,
    tags:req.body.tags
   }
   const data =await Internships.updateOne({_id:req.params.id},{$set:updatedData})
   if(!data) return next(new Error('no added',500))
    res.status(201).send(data)
  }
  
  
  
  
  
exports.UpdateInertshipStaus=async(req,res,next)=>{
  const data =await Internships.updateOne({_id:req.params.id},{$set:{status:req.body.status}})
  if(!data) return next(new Error('no added',500))
   res.status(201).send(data)
}



exports.CreateUser =async(req,res,next)=>{
    const userdata=await User.create({
        name:req.body.name,
        email:req.body.email,
        PhoneNumber:req.body.phoneNumber,
        password:`${req.body.name}@123`,
        confirmPassword:`${req.body.name}@123`,
        status:'active'
    })
  if(!userdata)return next(new Error('User not be created',500))
  res.status(201).send(userdata)
}


exports.GetAllUser =FactoryHandler.getAll(User)
exports.GetOneUser =FactoryHandler.getOne(User)
exports.updateUser =FactoryHandler.updateOne(User)
exports.UpdateUserStatus =FactoryHandler.updateOne(User)





//Create Company

exports.CreateCompany =async(req,res,next)=>{
   const companyData =await Company.create({
    name:req.body.name,
    email:req.body.email,
    PhoneNumber:req.body.phoneNumber,
    location:req.body.location,
    address:req.body.address,
    password:`${req.body.name.replace(/\s/g, "")}@123`,
    confirmPassword:`${req.body.name.replace(/\s/g, "")}@123`,
   })
   if(!companyData)return next(new Error('User not be created',500))
  res.status(201).send(companyData)
}




exports.GetAllCompany =FactoryHandler.getAll(Company)
exports.GetOneCompany =FactoryHandler.getOne(Company)
exports.updateCompany=FactoryHandler.updateOne(Company)
exports.UpdateCompanyStatus =FactoryHandler.updateOne(Company)






