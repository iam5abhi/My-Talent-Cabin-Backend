const Error =require('../Utils/ErrorHandler/ErrorHandler')
const bcrypt = require("bcrypt")
const createSendToken = require("../suscribers/createSendToken");
const base64 = require("base-64");
const { validationResult } = require("express-validator");
const {UPDATE_PASSWORD_SUCCESS,OLD_PASSWORD_NOT_MATCH,PASSWORD_NOT_MATCH}=require('../ConstandMessage/Message');
const { Model } = require('mongoose');




exports.UpdatePasswordHandler =Model=>{
   return async(req,res,next)=>{
    let old_password = base64.decode(req.body.old_password);
    let new_password = base64.decode(req.body.new_password);
    let new_confirmpassword = base64.decode(req.body.new_confirmpassword);
    const user = await Model.findOne({ _id: req.data.user._id}).select("+password");
    if (bcrypt.compareSync(old_password, user.password)) {
       if (new_password != new_confirmpassword) {
          return next(new Error(PASSWORD_NOT_MATCH,400));
       }
       const salt = await bcrypt.genSalt();
       let Hashpassword = bcrypt.hashSync(new_password, salt);
      const data =await Model.findOneAndUpdate({_id: req.data.user._id},{password:Hashpassword}).select("+password");
       createSendToken(data,200,req,res,UPDATE_PASSWORD_SUCCESS)
    } else {
       return next(new Error(OLD_PASSWORD_NOT_MATCH,400))
    }
   }
}


exports.getAll =Model=>{     
   return async(req,res,next)=>{     
      Model.find({},function(err,data){
         if(!data)return next(new Error("Data is not Availble",400));
         res.status(200).send({status:true,data:data})
      })
   }
}


exports.Add =Model=>{   
    return async(req,res,next)=>{      
       const newdata =new Model(req.body)
       newdata.save((err,data)=>{
       if(err) return next(new Error(err.message))
         res.status(200).send({message:"Add sucessfully",data:data})
      })
    }
}




exports.updateOne =Model=>{
   return async(req,res,next)=>{       
      Model.findOneAndUpdate({_id:req.params.id},req.body,function(err,data){
         if(err) return next(new Error(err.message))
         res.status(200).send({message:"Update sucessfully",data:data})
      })
   }
}


exports.getOne =Model=>{
   return async(req,res,next)=>{       
      Model.findOne({_id:req.params.id},function(err,data){
         if(!data) return next(new Error(`data is not availble`,400))
         res.status(200).send({data:data})
      })
   }
}


exports.deleteOne=Model=>{
   return async(req,res,next)=>{    
      Model.findOneAndDelete({_id:req.params.id},function(err,data){
         if(!data) return next(new Error(`${err.message}`,400))
         res.status(200).send({message:`Delete Quession Sucessfully`})
      })
   }  
}


exports.CheckAllData =(Model,role)=>{
   return async(req,res,next)=>{        
      Model.find({role:role},function(err,data){
         if(!data)return next(new Error("Data is not Availble",400));
         res.status(200).send({status:true,data:data})
      }).select("+status");   
   }
}