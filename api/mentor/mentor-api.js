const express = require("express");
const mentorrouter = express.Router();
const menorcontroller =require('../../Controllers/mentorController/mentorcontroller')
const isAuthenticated =require('../../Middleware/isAuthenticated/isAuthenticated')
const commoncontroller =require('../../common/commonControllers')



mentorrouter.route('/signup').post(menorcontroller.signup)
mentorrouter.route('/login').post(menorcontroller.login)
mentorrouter.route('/view-profile/:id').get(menorcontroller.getSingleProfile)

mentorrouter.use(isAuthenticated)


mentorrouter.route('/change-password').patch(menorcontroller.update_password)

mentorrouter.route('/').get(menorcontroller.getProfile)



mentorrouter.route('/skill').get(commoncontroller.getAllSubCategory)


mentorrouter.route('/add-location').patch(menorcontroller.addloaction)
mentorrouter.route('/add-language').patch(menorcontroller.addLanguage)
mentorrouter.route('/delete-language').patch(menorcontroller.removeLanguage)
mentorrouter.route('/add-education').patch(menorcontroller.addEducation)
mentorrouter.route('/delete-education').patch(menorcontroller.removeEducation)
mentorrouter.route('/add-bio').patch(menorcontroller.addBio)
mentorrouter.route('/add-skill').patch(menorcontroller.addSkills) 
mentorrouter.route('/delete-skill').patch(menorcontroller.removeSkill)
mentorrouter.route('/add-exp').patch(menorcontroller.addExprince)
mentorrouter.route('/delete-exp').patch(menorcontroller.removeExprience)

mentorrouter.route('/me-enroll-project').get(menorcontroller.enrollProject)



mentorrouter.route('/intership').post(menorcontroller.AddInternships)
mentorrouter.route('/intership/:id').get(menorcontroller.GetOneInternships).patch(menorcontroller.updateIntership)




module.exports =mentorrouter