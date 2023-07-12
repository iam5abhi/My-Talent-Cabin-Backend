const { check } = require("express-validator")

exports.updatePasswordHandler=()=>{
    return[
        check('old_password').notEmpty().withMessage("password is required"),
        check("old_password").isLength({min:5}).withMessage('must be at least 5 chars && digit long'),
        check('new_password').notEmpty().withMessage("new_password is required"),
        check("new_password").isLength({min:5}).withMessage('must be at least 5 chars && digit long'),
        check('new_confirmpassword').notEmpty().withMessage("new_confirmpassword is required"),
        check("new_confirmpassword").isLength({min:5}).withMessage('must be at least 5 chars && digit long'),
    ]
}