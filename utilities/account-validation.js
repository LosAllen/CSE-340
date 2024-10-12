const utilities = require("./index");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/* **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
      // Firstname: required, trimmed, sanitized
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."),
  
      // Lastname: required, trimmed, sanitized
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."),
  
      // Email: required, valid format, normalized
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required."),
  
      // Password: required, strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ];
};

validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("account/register", {
        errors: errors.array(),
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      });
      return;
    }
    next();
};
  
  body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail()
  .withMessage("A valid email is required.")
  .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email);
    if (emailExists) {
      throw new Error("Email exists. Please log in or use a different email.");
    }
    }),

  body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail()
  .withMessage("A valid email is required."),
    body("account_password")
  .notEmpty()
  .withMessage("Password is required."),

validate.inventoryRules = () => {
    return [
      body("inv_make").trim().escape().notEmpty().withMessage("Make is required."),
      // Add similar rules for each field
    ];
  };
  

  module.exports = validate;
