// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to get a specific vehicle's details by ID
router.get("/detail/:invId", invController.buildByInvId);

module.exports = router;

// Intentional error route
router.get("/error", (req, res, next) => {
    const error = new Error("Intentional 500 Error");
    error.status = 500;
    next(error); // Pass to error handling middleware
  });
  