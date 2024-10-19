const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const validate = require("../utilities/account-validation");
const utilities = require("../utilities");

// Route to process login
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to render account management (needs login)
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

module.exports = router;

// Route to render the account update view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdate));

// Route to handle the account update process
router.post("/update", utilities.handleErrors(accountController.updateAccount));

// Route to handle the password update process
router.post("/update-password", utilities.handleErrors(accountController.updatePassword));

// Route to handle logout
router.get("/logout", utilities.handleErrors(accountController.logout));
