const express = require("express");
const studentrouter = express.Router();
const studentcontroller =require('../../Controllers/usercontroller/usercontroller')
const isAuthenticated =require('../../Middleware/isAuthenticated/isAuthenticated')


studentrouter.route('/signup').post(studentcontroller.signup)
studentrouter.route('/login').post(studentcontroller.login)

studentrouter.use(isAuthenticated)

studentrouter.route('/change-password').patch(studentcontroller.update_password)








module.exports =studentrouter