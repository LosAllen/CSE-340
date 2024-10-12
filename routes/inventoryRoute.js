// Needed Resources 
const express = require("express")
const router = new express.Router() 
const inventoryController = require("../controllers/inventoryController");
const validate = require("../utilities/account-validation"); // or the correct path to the validate module


// Route to build inventory by classification view
router.get("/type/:classificationId", inventoryController.buildByClassificationId);
// Route to get a specific vehicle's details by ID
router.get("/detail/:invId", inventoryController.buildByInvId);
router.get("/management", inventoryController.buildManagement);
router.post("/add-classification", validate.classificationRules(), inventoryController.addClassification);
router.post("/add-inventory", validate.inventoryRules(), inventoryController.addInventory);

// Intentional error route
router.get("/error", (req, res, next) => {
    const error = new Error("Intentional 500 Error");
    error.status = 500;
    next(error); // Pass to error handling middleware
  });
  

  module.exports = router;