const jwt =require('jsonwebtoken')
const Error=require('../../Utils/ErrorHandler/ErrorHandler')


module.exports=(req,res,next)=>{
   const token =req.headers.authorization
   if(!token) return next(new Error(`You   not logged in! Please log in to get acesses`,401))
   const Decode = jwt.verify(token.split(" ")[1],process.env.SECRETKEY)
   req.data =Decode
   next()
}