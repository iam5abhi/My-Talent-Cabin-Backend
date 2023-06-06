const express = require("express");
const adminrouter = express.Router();
const admincontroller =require('../../Controllers/admincontrollers/admincontrollers')
const isAuthenticated =require('../../Middleware/isAuthenticated/isAuthenticated')


adminrouter.route('/signup').post(admincontroller.signup)
adminrouter.route('/login').post(admincontroller.login)

adminrouter.use(isAuthenticated)

adminrouter.route('/change-password').patch(admincontroller.update_password)

adminrouter.route('/category').post(admincontroller.addcategory).get(admincontroller.getallcategory)
adminrouter.route('/category/:id').get(admincontroller.getcategory).patch(admincontroller.editcategory)
adminrouter.route('/category-status/:id').patch(admincontroller.updatestatus)





module.exports =adminrouter