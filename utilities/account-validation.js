const { body } = require('express-validator');

const validate = {};

// Classification validation rules
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isAlphanumeric()
      .withMessage("No spaces or special characters allowed."),
  ];
};

// Login validation rules
validate.loginRules = () => {
  return [
    body("account_email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .trim()
      .escape(),
    body("account_password")
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .trim()
      .escape(),
  ];
};

// Check login data for validation errors
validate.checkLoginData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.array());
    return res.status(400).redirect('/account/login');
  }
  next();
};

module.exports = validate;
