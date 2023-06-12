const express = require("express");
const studentrouter = express.Router();
const studentcontroller =require('../../Controllers/usercontroller/usercontroller')
const isAuthenticated =require('../../Middleware/isAuthenticated/isAuthenticated')


studentrouter.route('/signup').post(studentcontroller.signup)
studentrouter.route('/login').post(studentcontroller.login)

studentrouter.use(isAuthenticated)

studentrouter.route('/change-password').patch(studentcontroller.update_password)

studentrouter.route('/').get(studentcontroller.getprofile)
studentrouter.route('/skill').get(studentcontroller.getAllSubCategory)


studentrouter.route('/add-location').patch(studentcontroller.addloaction)
studentrouter.route('/add-language').patch(studentcontroller.addLanguage)
studentrouter.route('/add-education').patch(studentcontroller.addEducation)
studentrouter.route('/add-bio').patch(studentcontroller.addBio)
studentrouter.route('/add-skill').patch(studentcontroller.addSkills)
studentrouter.route('/delete-skill').patch(studentcontroller.removeSkill)
studentrouter.route('/add-exp').patch(studentcontroller.addExprince)





module.exports =studentrouter