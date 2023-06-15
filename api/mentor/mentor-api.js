const express = require("express");
const mentorrouter = express.Router();
const menorcontroller =require('../../Controllers/mentorController/mentorcontroller')
const isAuthenticated =require('../../Middleware/isAuthenticated/isAuthenticated')



mentorrouter.route('/signup').post(menorcontroller.signup)
mentorrouter.route('/login').post(menorcontroller.login)

mentorrouter.use(isAuthenticated)


mentorrouter.route('/change-password').patch(menorcontroller.update_password)

mentorrouter.route('/').get(menorcontroller.getProfile)



mentorrouter.route('/skill').get(studentcontroller.getAllSubCategory)


mentorrouter.route('/add-language').patch(menorcontroller.addLanguage)
mentorrouter.route('/add-personal-information').patch(menorcontroller.addBio)
mentorrouter.route('/add-skill').patch(menorcontroller.addSkills) 
mentorrouter.route('/add-exp').patch(menorcontroller.addExprince)
mentorrouter.route('/delete-exp').patch(menorcontroller.removeExprience)



module.exports =mentorrouter