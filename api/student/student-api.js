const express = require("express");
const studentrouter = express.Router();
const studentcontroller =require('../../Controllers/usercontroller/usercontroller')
const commoncontroller =require('../../common/commonControllers')
const isAuthenticated =require('../../Middleware/isAuthenticated/isAuthenticated')


studentrouter.route('/signup').post(studentcontroller.signup)
studentrouter.route('/login').post(studentcontroller.login)

studentrouter.use(isAuthenticated)

studentrouter.route('/change-password').patch(studentcontroller.update_password)

studentrouter.route('/').get(studentcontroller.getprofile)
studentrouter.route('/skill').get(commoncontroller.getAllSubCategory)


studentrouter.route('/add-location').patch(studentcontroller.addloaction)
studentrouter.route('/add-language').patch(studentcontroller.addLanguage)
studentrouter.route('/delete-language').patch(studentcontroller.removeLanguage)
studentrouter.route('/add-education').patch(studentcontroller.addEducation)
studentrouter.route('/delete-education').patch(studentcontroller.removeEducation)
studentrouter.route('/add-bio').patch(studentcontroller.addBio)
studentrouter.route('/add-skill').patch(studentcontroller.addSkills) 
studentrouter.route('/delete-skill').patch(studentcontroller.removeSkill)
studentrouter.route('/add-exp').patch(studentcontroller.addExprince)
studentrouter.route('/delete-exp').patch(studentcontroller.removeExprience)


studentrouter.route('/internship').get(studentcontroller.getAllInternship)

studentrouter.route('/internship/:id').get(studentcontroller.getOneInternship).patch(studentcontroller.enrollStudent)


studentrouter.route('/project-enroll').get(studentcontroller.StudentEnrollProject)



module.exports =studentrouter