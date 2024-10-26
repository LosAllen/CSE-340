/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const accountRoute = require("./routes/accountRoute")
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const utilities = require('./utilities');
const reviewRoutes = require('./routes/reviewRoute');

/* ***********************
 * view engine and templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
app.use(cookieParser());
app.use(utilities.checkJWTToken);


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ***********************
 * Routes
 *************************/
app.use(static)
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use("/acc", accountRoute)
app.use('/review', reviewRoutes);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { title: "Error", message: "Something went wrong!" });
});
