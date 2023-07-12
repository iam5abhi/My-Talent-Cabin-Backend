const Error =require('../../Utils/ErrorHandler/ErrorHandler')
exports.resticrtTo =(...role)=>{   
    return (req,res,next)=>{
        if(!role.includes(req.data.user.role)){
            return next(new Error('You do not have permission to peform this Action',403))
        }
        next()
    }
}