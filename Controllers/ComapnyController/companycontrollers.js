const Company =require('../../Models/Company/CompanySchema')
const FactoryHandler =require('../../FactoryHandler/factoryhandler')
const base64 = require("base-64");
const mongoose =require('mongoose')
const { REGISTRATION_SUCCESS, PASSWORD_NOT_MATCH, COMPARE_PASSWORD_USING_DB, LOGIN_SUCCESS, USER_ALREADY_EXIST } = require('../../ConstandMessage/Message')
const createSendToken = require("../../suscribers/createSendToken");




exports.signup = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword,PhoneNumber} = req.body;
        if (base64.decode(password) !== base64.decode(confirmPassword)) return next(new Error(PASSWORD_NOT_MATCH, 400));
        const existingAdmin = await Company.findOne({ email });
        if (existingAdmin) return next(new Error(USER_ALREADY_EXIST, 400));
        const newUser = new Company({ name, email,PhoneNumber, password:base64.decode(password), confirmPassword:base64.decode(confirmPassword)});
        const savedUser = await newUser.save();
        res.status(200).send({
            message: REGISTRATION_SUCCESS,
            success: true,
            name: savedUser.name,
            email: savedUser.email,
            PhoneNumber:savedUser.PhoneNumber
        });
    } catch (err) {next(new Error(`${err}`, 500))}
}



exports.login = async (req, res, next) => {
    try {
        const password = base64.decode(req.body.password);
        const user = await Company.findOne({email: req.body.email }, {createdAt: 0 })
        if (!user) return next(new Error(COMPARE_PASSWORD_USING_DB, 400));
        const isMatch = await user.comparepassword(password);
        if (!isMatch) return next(new Error(COMPARE_PASSWORD_USING_DB, 400));
        createSendToken(user, 200, req, res, LOGIN_SUCCESS);
    } catch (error) {
        next(new Error(`${error}`, 500))
    }
}



exports.update_password =FactoryHandler.UpdatePasswordHandler(Company)



exports.getprofile =async(req,res,next)=>{
    const ObjectID = mongoose.Types.ObjectId; 
    Company.aggregate([{$match:{_id:ObjectID(req.data.user._id)}}])
    .exec((err, result) => {
        if (err) {next(new Error(`${err.message}`, 500))} 
        else {res.status(200).send(result)}
    });
}


exports.addSocialMedia =async(req,res,next)=>{
    Company.updateOne({email:req.data.user.email},{$set:{linkedin_url:req.body.linkedinurl}})
    .then(() => {
        res.status(200).send({ message: "added successfully" });
    })
    .catch((err) => {
        next(new Error(`${err.message}`, 500));
    }); 
}



exports.addcompanyBio =async(req,res,next)=>{
    Company.updateOne({email:req.data.user.email},{$set:{bio:req.body.bio,video_url:req.body.url}})
    .then(() => {
        res.status(200).send({ message: "added successfully" });
    })
    .catch((err) => {
        next(new Error(`${err.message}`, 500));
    }); 
}



exports.addHr =async(req,res,next)=>{
    Company.updateOne({email:req.data.user.email},{$push:{hr:{name:req.body.name,designation:req.body.designation}}})
    .then(() => {
        res.status(200).send({ message: "added successfully" });
    })
    .catch((err) => {
        next(new Error(`${err.message}`, 500));
    }); 
}     




exports.DeleteHr =async(req,res,next)=>{
    Company.updateOne(
        { email: req.data.user.email },
        { $pull:{ hr:{_id:req.body._id} }}
    )
    .then(() => {
        res.status(200).send({ message: "Element removed successfully" });
      })
      .catch((err) => {
        next(new Error(`${err.message}`, 500));
      });
}