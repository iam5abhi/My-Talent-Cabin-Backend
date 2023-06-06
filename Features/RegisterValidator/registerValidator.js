const { check } = require("express-validator")

exports.registerValidator=()=>{
    return[
        check("name").notEmpty().withMessage("name is required"),
        check("name").isLength({min:3}).withMessage('must be at least 3 chars long'),
        check("name").matches(/^[a-zA-Z ]{2,30}$/).withMessage('Please fill the valid name'),
        check('email').notEmpty().withMessage('email is required'),
        check('email').isEmail().withMessage('email is not valid'),
        check('email').matches( /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/).withMessage('Please fill a valid email address'),
        check('phoneNumber').notEmpty().withMessage("phoneNumber is required"),
        check("phoneNumber").isLength({min:10}).withMessage('must be at least 10 digit long'),
        check('password').notEmpty().withMessage("password is required"),
        check("password").isLength({min:5}).withMessage('must be at least 5 chars && digit long'),
        check('confirmPassword').notEmpty().withMessage("confirmPassword is required"),
        check("confirmPassword").isLength({min:5}).withMessage('must be at least 5 chars && digit long'),
    ]
}