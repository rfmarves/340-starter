// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by InventoryId view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// trigger an error
router.get("/unknown", utilities.handleErrors(invController.forcedError));

// Route to add classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route for management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

module.exports = router;