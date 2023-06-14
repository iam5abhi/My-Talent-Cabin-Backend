const express = require("express");
const companyrouter = express.Router();
const companycontroller =require('../../Controllers/ComapnyController/companycontrollers')
const isAuthenticated =require('../../Middleware/isAuthenticated/isAuthenticated')


companyrouter.route('/signup').post(companycontroller.signup)
companyrouter.route('/login').post(companycontroller.login)

companyrouter.use(isAuthenticated)

companyrouter.route('/change-password').patch(companycontroller.update_password)

companyrouter.route('/').get(companycontroller.getprofile)


companyrouter.route('/add-social-media-link').patch(companycontroller.addSocialMedia)
companyrouter.route('/add-company-bio').patch(companycontroller.addcompanyBio)
companyrouter.route('/add-hr').patch(companycontroller.addHr)
companyrouter.route('/delete-hr').patch(companycontroller.DeleteHr)








module.exports =companyrouter