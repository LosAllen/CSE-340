const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route to display the login view
router.get("/login", accountController.buildLogin);
// Route to display the registration view
router.get("/register", accountController.buildRegister);
// Route to handle registration data submission
router.post("/register", accountController.registerAccount);
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
router.post("/login", (req, res) => {
    res.status(200).send("login process");
  });
// Error handler middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
