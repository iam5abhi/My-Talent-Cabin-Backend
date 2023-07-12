const User =require('../../Models/User/UserSchema')
const Error =require('../../Utils/ErrorHandler/ErrorHandler')
const createSendToken=require('../../suscribers/createSendToken')
const { validationResult } = require("express-validator");
const {COMPARE_PASSWORD_USING_DB,LOGIN_SUCCESS} =require('../../ConstandMessage/Message')
const CatchAsyncHandler =require('../../Middleware/Error/CatchAsyncHandler')
const base64 = require("base-64");



exports.Login =CatchAsyncHandler(async(req, res, next) => {
  
   
    const password = base64.decode(req.body.password);
    const errors = validationResult(req);
    if (!errors.isEmpty())
       return res.status(422).send({ errors: errors.array() });
       User.findOne({email:req.body.email}, async function (err, user) {
       if (!user) return next(new Error(COMPARE_PASSWORD_USING_DB, 400));
       await User.findOneAndUpdate({email:req.body.email},{lastLogin:new Date()+ 10 * 60 * 1000},{new:true})
       const isMatch = await user.comparepassword(password);
       if (!isMatch) return next(new Error(COMPARE_PASSWORD_USING_DB, 400));
       createSendToken(user,200,req,res,LOGIN_SUCCESS)
    }).select("+password");
 });
 



