const { validationResult } = require("express-validator");
const base64 = require("base-64");

const Admin = require('../../Models/Admin/admin')
const Error = require("../../Utils/ErrorHandler/ErrorHandler");
const CatchAsyncHandler = require('../../Middleware/Error/CatchAsyncHandler')
const createSendToken = require("../../suscribers/createSendToken");
const { REGISTRATION_SUCCESS, PASSWORD_NOT_MATCH, COMPARE_PASSWORD_USING_DB, LOGIN_SUCCESS, USER_ALREADY_EXIST } = require('../../ConstandMessage/Message')
const FactoryHandler =require('../../FactoryHandler/factoryhandler')


exports.signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() });
        const { username, email, password, confirmPassword } = req.body;
        console.log(username, email, password, confirmPassword)
        if (base64.decode(password) !== base64.decode(confirmPassword)) return next(new Error(PASSWORD_NOT_MATCH, 400));
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return next(new Error(USER_ALREADY_EXIST, 400));
        const newAdmin = new Admin({ username, email, password:base64.decode(password), confirmPassword:base64.decode(confirmPassword)});
        const savedAdmin = await newAdmin.save();
        res.status(200).send({
            message: REGISTRATION_SUCCESS,
            success: true,
            name: savedAdmin.name,
            email: savedAdmin.email,
        });
    } catch (err) {
        next(new Error(`${err}`, 500))
    }
}


exports.login = async (req, res, next) => {
    try {
        const password = base64.decode(req.body.password);
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() });

        const user = await Admin.findOne({ email: req.body.email }, {createdAt: 0 })
        if (!user) return next(new Error(COMPARE_PASSWORD_USING_DB, 400));

        const isMatch = await user.comparepassword(password);
        if (!isMatch) return next(new Error(COMPARE_PASSWORD_USING_DB, 400));
        createSendToken(user, 200, req, res, LOGIN_SUCCESS);
    } catch (error) {
        next(new Error(`${error}`, 500))
    }
}


exports.update_password =FactoryHandler.UpdatePasswordHandler(Admin)









