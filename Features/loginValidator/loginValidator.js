const { check } = require("express-validator")

exports.loginValidator=()=>{
    return[
        check('email').notEmpty().withMessage('email is required'),
        check('email').isEmail().withMessage('email is not valid'),
        check('password').notEmpty().withMessage("password is required"),
    ]
}