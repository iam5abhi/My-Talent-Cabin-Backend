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


adminrouter.route('/subcategory').post(admincontroller.AddSubCategory).get(admincontroller.GetAllSubCategory)
adminrouter.route('/subcategory/:id').get(admincontroller.GetOneSubCategory).patch(admincontroller.UpdateSubCategory)
adminrouter.route('/subcategory-status/:id').patch(admincontroller.UpdateSubCategoryStatus)
adminrouter.route('/subcategory-data').get(admincontroller.getallSubcategories)



adminrouter.route('/intership').post(admincontroller.AddInternships).get(admincontroller.GetAllInternships)
adminrouter.route('/intership/:id').get(admincontroller.GetOneInternships).patch(admincontroller.updateIntership)
adminrouter.route('/intership-status/:id').patch(admincontroller.UpdateInertshipStaus)




adminrouter.route('/user').post(admincontroller.CreateUser).get(admincontroller.GetAllUser)
adminrouter.route('/user/:id').get(admincontroller.GetOneUser).patch(admincontroller.updateUser)
adminrouter.route('/user-status/:id').patch(admincontroller.UpdateUserStatus)





adminrouter.route('/company').post(admincontroller.CreateCompany).get(admincontroller.GetAllCompany)
adminrouter.route('/company/:id').get(admincontroller.GetOneCompany).patch(admincontroller.updateCompany)
adminrouter.route('/company-status/:id').patch(admincontroller.UpdateCompanyStatus)








module.exports =adminrouter