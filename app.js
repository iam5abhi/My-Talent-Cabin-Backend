const express = require("express");
const morgan =require('morgan')
const cors = require("cors")
const Error=require('./Utils/ErrorHandler/ErrorHandler')
const GloBalErrorHandler =require('./Middleware/Error/Error')

const admin =require('./api/admin/admim-api')
const student =require('./api/student/student-api')



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



// Page Not Found Error
app.use('*',(req,res,next)=>{
    next(new Error(`can't find ${req.originalUrl} on this server`,404))
})


// Global Error Handler
app.use(GloBalErrorHandler)



module.exports =app