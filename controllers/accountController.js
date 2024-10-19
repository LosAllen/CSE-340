const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const accountModel = require('../models/account-model');
const utilities = require('../utilities');

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
  
    // Hash the password before storing
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(account_password, 10);
    } catch (error) {
      req.flash("notice", "Sorry, there was an error processing the registration.");
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
      return;
    }
  
    // Replace the plain text password with hashedPassword in the registration function
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );
  
    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }
  }

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null, // Initialize errors to avoid issues on initial load
    });
  }

  async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }

  async function buildManagement(req, res) {
    let nav = await utilities.getNav();
    res.render('account/management', {
      title: 'Management',
      nav,
      errors: null,
    });
  }

  async function login(req, res) {
    const { account_email, account_password } = req.body;
  
    try {
      // Verify user credentials
      const user = await accountModel.findByEmail(account_email);
      if (user && bcrypt.compareSync(account_password, user.account_password)) {
        // Generate JWT token
        const token = jwt.generateToken(user);
  
        // Set the token as an HTTP-only cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1-hour expiry
  
        // Redirect to a protected page or send success response
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).send('An error occurred during login');
    }
  }

  async function accountLogin(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);
  
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
      return;
    }
  
    try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password;
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
  
        // Use secure cookies in production
        const cookieOptions = {
          httpOnly: true,
          maxAge: 3600 * 1000,
        };
        if (process.env.NODE_ENV === 'production') {
          cookieOptions.secure = true;
        }
  
        res.cookie('jwt', accessToken, cookieOptions);
        return res.redirect('/account/');
      } else {
        req.flash("notice", "Please check your credentials and try again.");
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        });
      }
    } catch (error) {
      throw new Error("Access Forbidden");
    }
  }
  
  module.exports = { buildLogin, buildRegister, registerAccount, login, accountLogin, buildManagement };

/* ****************************************
 *  Deliver the Account Update View
 * *************************************** */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);
  if (accountData) {
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  } else {
    req.flash("notice", "Account not found.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Handle the Account Update Process
 * *************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
  if (updateResult) {
    req.flash("notice", "Account successfully updated.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Failed to update the account.");
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 *  Handle Password Update Process
 * *************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", "Error hashing the password.");
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
    return;
  }

  const passwordUpdateResult = await accountModel.updatePassword(account_id, hashedPassword);
  if (passwordUpdateResult) {
    req.flash("notice", "Password updated successfully.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Failed to update the password.");
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Handle Logout Process
 * *************************************** */
function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

module.exports = {
  buildLogin, 
  buildRegister, 
  registerAccount, 
  login, 
  accountLogin, 
  buildManagement, 
  buildAccountUpdate, 
  updateAccount, 
  updatePassword,
  logout
};
