const ErrorHandler =require('../../Utils/ErrorHandler/ErrorHandler')

module.exports =(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500
    err.message =err.message || `Internal Server Error`

     // //wrong mongodb id error
     if(err.name =='CastError'){
         const message =`Resouse not found with this id... invalid  ${err.path}`
         err=new ErrorHandler(message,400)
     }

    // duplicate Error  
    if(err.code ===11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered `
         err=new ErrorHandler(message,400)

    }

    if (err.name === "TokenExpiredError") {
        const message = `Your url is expired please try again`;
        err = new ErrorHandler(message, 400);
        }

    // Wrong Jwt error
     if (err.name === "JsonWebTokenError") {
        const message = `Your url is invalid please try again`;
        err = new ErrorHandler(message, 400);
        }




    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}