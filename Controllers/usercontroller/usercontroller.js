const User =require('../../Models/User/UserShema')
const FactoryHandler =require('../../FactoryHandler/factoryhandler')
const base64 = require("base-64");
const mongoose =require('mongoose')
const { REGISTRATION_SUCCESS, PASSWORD_NOT_MATCH, COMPARE_PASSWORD_USING_DB, LOGIN_SUCCESS, USER_ALREADY_EXIST } = require('../../ConstandMessage/Message')
const createSendToken = require("../../suscribers/createSendToken");
const SubCategory =require('../../Models/category/subcategory')
const Intership =require('../../Models/Internship/Internship')



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
            {email: req.body.email },{status:'active'}]}, {createdAt: 0,updatedAt:0,education:0,bio:0,accountCreated:0,experience:0,status:0,Certification:0,skills:0,language:0,location:0})
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
        },
        {
            $lookup:{
                from:'subcategories',
                localField:'skills',
                foreignField:"_id",
                as:'myskill'
            }
        },
        {
            $project:{
                skills:0,
                password:0,
                confirmPassword:0,
                isAccountVerified:0,
                accountCreated:0,
                status:0,
                createdAt:0,
                updatedAt:0
                
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
    res.status(200).send(subcategory)
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
            res.status(200).send({message:"Location added Sucessfully"})
            }
    })
}



exports.addLanguage =async(req,res,next)=>{
    const ObjectID = mongoose.Types.ObjectId; 
    User.aggregate([
        {
            $match:{
                _id:ObjectID(req.data.user._id)
            }
        },
        {
            $addToSet: {
                language: {$each:req.body.language}
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
            res.status(200).send({message:"language added Sucessfully"})
            }
    })
}



exports.addEducation =async(req,res,next)=>{
    User.updateOne(
        { email: req.data.user.email },
        { $push: { education:  req.body.education } }
    )
    .then(() => {
        res.status(200).send({ message: "education added successfully" });
    })
    .catch((err) => {
        next(new Error(`${err.message}`, 500));
    });    
}





exports.addBio =async(req,res,next)=>{

    User.aggregate([
        {
            $match:{
                email:req.data.user.email
            }
        },
        {
            $set:{
                bio:req.body.bio
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
            res.status(200).send({message:"bio added Sucessfully"})
            }
    })
}



exports.addSkills =async(req,res,next)=>{
    User.updateOne(
        { email: req.data.user.email },
        { $addToSet: { skills: { $each: req.body.skills } } }
    )
    .then(() => {
        res.status(200).send({ message: "Skills added successfully" });
    })
    .catch((err) => {
        next(new Error(`${err.message}`, 500));
    });
}



exports.addExprince =async(req,res,next)=>{   
User.updateOne(
    { email: req.data.user.email },
    { $push: { experience:  req.body.experience } }
)
.then(() => {
    res.status(200).send({ message: "education added successfully" });
})
.catch((err) => {
    next(new Error(`${err.message}`, 500));
});    
}



exports.removeSkill =async(req,res,next)=>{
    User.updateOne(
        { email: req.data.user.email },
        { $pull: { skills: { $eq: req.body.value } } }
      )
      .then(() => {
        res.status(200).send({ message: "Element removed successfully" });
      })
      .catch((err) => {
        next(new Error(`${err.message}`, 500));
      });
}

exports.removeLanguage =async(req,res,next)=>{
    User.updateOne(
        { email: req.data.user.email },
        { $pull: { language: { $eq: req.body.value } } }
      )
      .then(() => {
        res.status(200).send({ message: "Element removed successfully" });
      })
      .catch((err) => {
        next(new Error(`${err.message}`, 500));
      });
}


exports.removeEducation =async(req,res,next)=>{
    User.updateOne(
        { email: req.data.user.email },
        { $pull: { education: {_id:req.body._id } } }
    )
    .then(() => {
        res.status(200).send({ message: "Element removed successfully" });
      })
      .catch((err) => {
        next(new Error(`${err.message}`, 500));
      });
}



exports.removeExprience =async(req,res,next)=>{
    User.updateOne(
        { email: req.data.user.email },
        { $pull: { experience: {_id:req.body._id} } }
    )
    .then(() => {
        res.status(200).send({ message: "Element removed successfully" });
      })
      .catch((err) => {
        next(new Error(`${err.message}`, 500));
      });
}

exports.getAllInternship =async(req,res,next)=>{
    Intership.aggregate([
        {$match:{}},
        {$project:{CompanyId:0,status:0,mentorId:0,updatedAt:0,createdAt:0,tags:0}}
    ]).exec((err, result)=>{
        if (err) 
        {
            next(new Error(`${err.message}`, 500))
        }else{
        res.status(200).send(result)
        }
    })
}



exports.getOneInternship =(req,res,next)=>{
    const ObjectID = mongoose.Types.ObjectId; 
    Intership.aggregate([
        {$match:{_id:ObjectID(req.params.id)}},
        {$project:{CompanyId:0,status:0,mentorId:0,updatedAt:0,createdAt:0,tags:0}}
    ]).exec((err, result)=>{
        if (err) 
        {
            next(new Error(`${err.message}`, 500))
        }else{
        res.status(200).send(result)
        }
    })
}