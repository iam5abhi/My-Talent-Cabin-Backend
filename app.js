const express = require("express");
const morgan =require('morgan')
const cors = require("cors")
const Error=require('./Utils/ErrorHandler/ErrorHandler')
const GloBalErrorHandler =require('./Middleware/Error/Error')

const admin =require('./api/admin/admim-api')
const student =require('./api/student/student-api')
const company =require('./api/comapny/company-api')
const mentor =require('./api/mentor/mentor-api')


const Razorpay = require('razorpay');


const razorpay = new Razorpay({
  key_id:  process.env.PAYMENTKEYID,
  key_secret: process.env.PAYMENTSECRETKEY
});



razorpay.orders.create(
  {
    amount: 50000, // Amount in paise (e.g., 50000 paise = ₹500)
    currency: 'INR',
    receipt: 'order_receipt',
    payment_capture: 1
  },
  function (error, order) {
    if (error) {
      console.error(error);
    } else {
      console.log(order);
    }
  }
);


const app = express();





app.use(express.urlencoded({extended:true,limit:"50000kb"}))
app.use(express.json({limit:"50000kb"}))


// adding morgan to log HTTP requests
app.use(morgan('dev'))

//handling the cros errro
app.use(cors());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });


// app.post('/login',menotcontroller.Login)


// Hand The employee-routes
app.use('/admin',admin)
app.use('/student',student)
app.use('/company',company)
app.use('/mentor',mentor)


// Page Not Found Error
app.use('*',(req,res,next)=>{
    next(new Error(`can't find ${req.originalUrl} on this server`,404))
})


// Global Error Handler
app.use(GloBalErrorHandler)



module.exports =app