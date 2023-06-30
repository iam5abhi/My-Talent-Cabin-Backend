const User =require('../../Models/User/UserShema')
const FactoryHandler =require('../../FactoryHandler/factoryhandler')
const base64 = require("base-64");
const mongoose =require('mongoose')
const axios =require('axios')
const { REGISTRATION_SUCCESS, PASSWORD_NOT_MATCH, COMPARE_PASSWORD_USING_DB, LOGIN_SUCCESS, USER_ALREADY_EXIST } = require('../../ConstandMessage/Message')
const createSendToken = require("../../suscribers/createSendToken");
const SubCategory =require('../../Models/category/subcategory')
const Intership =require('../../Models/Internship/Internship')
const stripe = require('stripe')(`sk_test_51IEpRgFDVtL6gGatPPQvwEh6fDrM0P4JSMAjwCKtipHQUhQHfgMf0cYwIvglclj3v5M2fIzBhip5KOzJK2nzz2mu00FFZrUwSe`)
const Transaction =require('../../Models/Payment/StripeTransaction')
const Razorpay = require('razorpay');
const crypto = require('crypto');
const PaymentDetailsWithRazorPay =require('../../Models/Payment/PaymentDetailsSchema')

let otp;





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
    User.updateOne({email:req.data.user.email},{ $addToSet: { language: { $each: req.body.language } } }).exec((err, result) => {
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
        {
            $lookup:{
                from:'mentors',
                localField:'mentorId',
                foreignField:'_id',
                as:'MentorData'
            }
        },
        {
            $lookup:{
                from:'subcategories',
                localField:'tags._id',
                foreignField:'_id',
                as:'skilldata'
            }
        },
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



exports.enrollStudent =(req,res,next)=>{   
        Intership.updateOne({_id:req.params.id},{$push:{enrollStudent:{studentId:req.data.user._id,description:req.body.description}}}).exec((err,result)=>{
        if (err) 
        {
            next(new Error(`${err.message}`, 500))
        }else{
        res.status(200).send(result)
        }
    })
}



exports.updateManyInternshipStatus =(req,res,next)=>{
    Intership.updateMany({status:'complete'}).exec((err,result)=>{
        if (err) 
        {
            next(new Error(`${err.message}`, 500))
        }else{
        res.status(200).send(result)
        }
    })
}




exports.StudentEnrollProject =(req,res,next)=>{
    const ObjectID = mongoose.Types.ObjectId; 
    Intership.aggregate([
        {
            $match:{
                'enrollStudent.studentId':ObjectID(req.data.user._id)
            }
        },
        {
          $lookup:{
              from:'mentors',
              localField:'mentorId',
              foreignField:'_id',
              as:'MentorData'
          }
      },
    {
      $lookup:{
          from:'subcategories',
          localField:'tags._id',
          foreignField:'_id',
          as:'tags'
      }
    },
    {
      $project:{
        enrollStudent:0,tags:0,mentorId:0,CompanyId:0
      }
    }
    ]).exec((err, result)=>{
        if (err) 
        {
            next(new Error(`${err.message}`, 500))
        }else{
        res.status(200).send(result)
        }
    })
}



exports.loginWithOtp =async(req,res,next)=>{
    otp =Math.floor(1000 + Math.random() * 9000);
    const user =await User.findOne({PhoneNumber:req.body.PhoneNumber})
    if(!user) return next(new Error('User is Not exits',500))
    axios.get(`https://sms.innuvissolutions.com/api/mt/SendSMS?APIKey=Try50kmHFUqu0MoBnX9Ojg&senderid=EDUTEK&channel=Trans&DCS=0&flashsms=0&number=${user.PhoneNumber}&text=%20Dear%20Parent,Your%20OTP%20for%20App%20Login%20is%20${otp}%20EDUTEK&route=1014&peid=1201159350821274881`)
    .then((response)=>{
        res.status(200).send({
        message:'Otp sent Sucessffuly',
        PhoneNumber:user.PhoneNumber
        })
    })
    .catch((err)=>{
    res.status(200).send({
        message:err.message,
        })
    })
}



exports.VerfiyWithOtp =async(req,res,next)=>{
    if(otp===Number(req.body.otp)){
        const user =await User.findOneAndUpdate({PhoneNumber:req.query.PhoneNumber},{status:"active"},{new:true})
        if(!user) return next(new Error('User is Not update',500))
        createSendToken(user, 200, req, res, LOGIN_SUCCESS);
    }else{
    return next(new Error(`Invalid Otp`),404)
    }
}



exports.ResendOtp =(req,res,next)=>{
    otp =Math.floor(1000 + Math.random() * 9000);
    User.findOne({PhoneNumber:req.query.PhoneNumber},function(err,data){
        if(err){
            return next(`user is not exits${err.message}`,404)
        }
        axios.get(`https://sms.innuvissolutions.com/api/mt/SendSMS?APIKey=Try50kmHFUqu0MoBnX9Ojg&senderid=EDUTEK&channel=Trans&DCS=0&flashsms=0&number=${data.PhoneNumber}&text=%20Dear%20Parent,Your%20OTP%20for%20App%20Login%20is%20${otp}%20EDUTEK&route=1014&peid=1201159350821274881`)
            .then((response)=>{
                res.status(200).json({
                message:`Otp Send Sucessfully`,
                })
            })
            .catch((err)=>{
            res.status(200).json({
                message:err.message
                })
            })
    })
}



exports.RazorPaymentGateway =async(req,res,next)=>{
    const data = await Intership.findOneAndUpdate(
        {_id:req.params.id},
        {
            $push:{
                enrollStudent:{
                    studentId:req.data.user._id,
                    description:req.body.description
                }
            }
     })
     const instance = new Razorpay({
        key_id: process.env.PAYMENTKEYID, // YOUR RAZORPAY KEY
        key_secret: process.env.PAYMENTSECRETKEY, // YOUR RAZORPAY SECRET
      });

      const options = {
        amount: data.price*100,
        currency: 'INR',
        receipt: 'receipt_order_74394',
      };
      const order = await instance.orders.create(options);
      if (!order) return res.status(500).send('Some error occured');
      res.status(200).send(order);
}

exports.RazorPaymentSucces =async(req,res,next)=>{
    const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      } = req.body;

      const shasum = crypto.createHmac('sha256', 'PWjt5xhtC58mThjnbi453NhZ');
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
      const digest = shasum.digest('hex');

      if (digest !== razorpaySignature)
      return res.status(400).json({ msg: 'Transaction not legit!' });

    const newPayment =await  PaymentDetailsWithRazorPay.create({
        razorpayDetails: {
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
          signature: razorpaySignature,

    },
        success: true,
      });
      res.status(200).send({
        msg: 'success',
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        User:req.data.user._id,
        Oder_id:req.body.Oder_id
      });
}




exports.RazorPaymentFailure =async(req,res,next)=>{
    const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      } = req.body;

      const shasum = crypto.createHmac('sha256', 'PWjt5xhtC58mThjnbi453NhZ');
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
      const digest = shasum.digest('hex');

      if (digest !== razorpaySignature)
      return res.status(400).json({ msg: 'Transaction not legit!' });

    const newPayment =await  PaymentDetailsWithRazorPay.create({
        razorpayDetails: {
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
          signature: razorpaySignature,
        },
        success: false,
    });
      res.status(200).send({
        msg: 'success',
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        User:req.data.user._id,
        Oder_id:req.body.Oder_id
      });
}


exports.StripePaymentGateWay=async(req,res,next)=>{
    const quantity =1
    const data = await Intership.findOneAndUpdate(
        {_id:req.params.id},
        {
            $push:{
                enrollStudent:{
                    studentId:req.data.user._id,
                    description:req.body.description
                }
            }
        })

    let price =Math.round(parseInt(data.price)/82.03)
    const session = await stripe.checkout.sessions.create({ 
      payment_method_types: ["card"], 
      line_items: [ 
        { 
          price_data: { 
            currency: "usd", 
            product_data: {
                name: data.title,
                metadata: {
                  InternshipID: data._id,
                  ProjectName: data.title,
                  InternshipWeek: data.internshipWeek,
                  InternshipType: data.internshipType,
                  studentId: req.data.user._id,
                  startDate: data.startDate,
                  endDate: data.endDate
                }
              }, 
              unit_amount:price*100
          }, 
          quantity: quantity, 
        }, 
      ], 
      mode: "payment", 
      customer_email:req.data.user.email,
      success_url: "http://localhost:3000", 
      cancel_url: "http://localhost:3000", 
    }); 
     const userTransaction =await Transaction.create({
         Transaction_id:session.id,
         Oder_id:req.params.id,
         User:req.data.user._id,
         amount:price,
         currency:session.currency,
         paymentMethod:session.payment_method_types[0],
         status:session.payment_status
     })
     if(!userTransaction) return next(new Error('no data',500))
    res.status(200).send(session)
}


exports.StirpemyOder =async(req,res,next)=>{
  console.log("hello")
}