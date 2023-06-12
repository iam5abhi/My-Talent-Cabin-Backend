const express = require("express");
const companyrouter = express.Router();
const companycontroller =require('../../Controllers/ComapnyController/companycontrollers')
const isAuthenticated =require('../../Middleware/isAuthenticated/isAuthenticated')


companyrouter.route('/signup').post(companycontroller.signup)
companyrouter.route('/login').post(companycontroller.login)

companyrouter.use(isAuthenticated)

companyrouter.route('/change-password').patch(companycontroller.update_password)

companyrouter.route('/').get(companycontroller.getprofile)








module.exports =companyrouter