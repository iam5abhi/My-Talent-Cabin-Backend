const User =require('../../Models/User/UserShema')
const FactoryHandler =require('../../FactoryHandler/factoryhandler')
const base64 = require("base-64");
const mongoose =require('mongoose')
const { REGISTRATION_SUCCESS, PASSWORD_NOT_MATCH, COMPARE_PASSWORD_USING_DB, LOGIN_SUCCESS, USER_ALREADY_EXIST } = require('../../ConstandMessage/Message')
const createSendToken = require("../../suscribers/createSendToken");
const SubCategory =require('../../Models/category/subcategory')



exports.signup = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword,PhoneNumber} = req.body;
        if (base64.decode(password) !== base64.decode(confirmPassword)) return next(new Error(PASSWORD_NOT_MATCH, 400));
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) return next(new Error(USER_ALREADY_EXIST, 400));
        const newUser = new User({ name, email,PhoneNumber, password:base64.decode(password), confirmPassword:base64.decode(confirmPassword)});
        const savedUser = await newUser.save();
        res.status(200).send({
            message: REGISTRATION_SUCCESS,
            success: true,
            name: savedUser.name,
            email: savedUser.email,
            PhoneNumber:savedUser.PhoneNumber
        });
    } catch (err) {
        next(new Error(`${err}`, 500))
    }
}




exports.login = async (req, res, next) => {
    try {
        const password = base64.decode(req.body.password);
        const user = await User.findOne({$and:[
            {email: req.body.email },{status:'active'}]}, {createdAt: 0 })
        if (!user) return next(new Error(COMPARE_PASSWORD_USING_DB, 400));
        const isMatch = await user.comparepassword(password);
        if (!isMatch) return next(new Error(COMPARE_PASSWORD_USING_DB, 400));
        createSendToken(user, 200, req, res, LOGIN_SUCCESS);
    } catch (error) {
        next(new Error(`${error}`, 500))
    }
}




exports.update_password =FactoryHandler.UpdatePasswordHandler(User)



exports.getprofile =(req,res,next)=>{
    const ObjectID = mongoose.Types.ObjectId; 
    User.aggregate([
        {
            $match:{
                _id:ObjectID(req.data.user._id)
            }
        }
    ])
    .exec((err, result) => {
        if (err) {
            next(new Error(`${err.message}`, 500))
        } else {
           res.status(200).send(result)
    }});
}




exports.getAllSubCategory =async(req,res,next)=>{
    const subcategory =await SubCategory.find({},{categoryId:0,status:0,createdAt:0,updatedAt:0})
    if(!subcategory) return next(new Error('no data is avaible'))
    res.status(200).send(SubCategory.validate)
}




exports.addloaction =async(req,res,next)=>{
    const ObjectID = mongoose.Types.ObjectId; 
    User.aggregate([
        {
            $match:{
                _id:ObjectID(req.data.user._id)
            }
        },
        {
            $set:{
                location:req.body.location
            }
        },
        {
            $merge: {
                into: 'users',
                on: '_id',
                whenMatched: 'replace',
                whenNotMatched: 'insert'
            }
        }
    ]).exec((err, result) => {
            if (err) 
            {
                next(new Error(`${err.message}`, 500))
            }else{
            res.status(200).send(result)
            }
    })
}




