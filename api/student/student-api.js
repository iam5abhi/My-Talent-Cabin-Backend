const express = require("express");
const studentrouter = express.Router();
const studentcontroller =require('../../Controllers/usercontroller/usercontroller')
const commoncontroller =require('../../common/commonControllers')
const isAuthenticated =require('../../Middleware/isAuthenticated/isAuthenticated')


studentrouter.route('/signup').post(studentcontroller.signup)
studentrouter.route('/login').post(studentcontroller.login)

studentrouter.route('/login-with-otp').post(studentcontroller.loginWithOtp)
studentrouter.route('/verify-otp').patch(studentcontroller.VerfiyWithOtp)
studentrouter.route('/resend-otp').get(studentcontroller.ResendOtp)

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

studentrouter.route('/paid-internship-with-razorpay/:id').patch(studentcontroller.RazorPaymentGateway)
studentrouter.route('/payment/sucess').patch(studentcontroller.RazorPaymentSucces)
studentrouter.route('/payment/cancel').patch(studentcontroller.RazorPaymentFailure)

studentrouter.route('/paid-internship-with-stripe/:id').patch(studentcontroller.StripePaymentGateWay)





module.exports =studentrouter