const express = require("express");
const mentorrouter = express.Router();
const menorcontroller =require('../../Controllers/mentorController/mentorcontroller')
const isAuthenticated =require('../../Middleware/isAuthenticated/isAuthenticated')



mentorrouter.route('/signup').post(menorcontroller.signup)
mentorrouter.route('/login').post(menorcontroller.login)

studentrouter.use(isAuthenticated)


studentrouter.route('/change-password').patch(menorcontroller.update_password)



module.exports =mentorrouter