const jwt =require('jsonwebtoken')

const signToken = user=>{
    return jwt.sign({user},process.env.SECRETKEY,{
        expiresIn:1000*60*60
    });
}

const createSendToken = (user, statusCode, req, res,message) => {
    const token = signToken(user);
    user.password = undefined;
    res.status(statusCode).send(
        {
            status: 'success',
            message:message,
            token:token,
            data:{
                user
            }
        }
    );
};


module.exports =createSendToken