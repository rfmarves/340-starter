// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accController.buildRegister));

// Route to process registration view
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accController.registerAccount));

// Process the login attempt
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accController.accountLogin))

// Route to update account view
router.get("/update", utilities.checkLogin, utilities.handleErrors(accController.buildAccountUpdate));

// Route to process account update
router.post("/update/data", utilities.checkLogin, regValidate.dataUpdateRules(), regValidate.checkUpdateData, utilities.handleErrors(accController.updateAccountData))

// Route to process password update
router.post("/update/password", utilities.checkLogin, regValidate.passwordUpdateRules(), regValidate.checkUpdatePassword, utilities.handleErrors(accController.updateAccountPassword))

// Route to account view
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildAccountManagement));


module.exports = router;