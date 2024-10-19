const express = require("express");
const router = new express.Router();
const inventoryController = require("../controllers/inventoryController");
const validate = require("../utilities/account-validation");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(inventoryController.buildByClassificationId));

// Route to get a specific vehicle's details by ID
router.get("/detail/:invId", utilities.handleErrors(inventoryController.buildByInvId));

// Route to render inventory management (requires login)
router.get("/management", utilities.checkLogin, utilities.handleErrors(inventoryController.buildManagement));

// Route to process adding classification
router.post(
  "/add-classification",
  validate.classificationRules(),
  utilities.handleErrors(inventoryController.addClassification)
);

// Route to process adding inventory
router.post(
  "/add-inventory",
  validate.classificationRules(), // Use actual inventory validation here
  utilities.handleErrors(inventoryController.addInventory)
);

module.exports = router;

// Route to return inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(inventoryController.getInventoryJSON));
