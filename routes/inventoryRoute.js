// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validateInventory = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by InventoryId view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// trigger an error
router.get("/unknown", utilities.handleErrors(invController.forcedError));

// Route to display the add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to process the add classification view
router.post("/add-classification", validateInventory.classificationRules(), validateInventory.checkClassificationData, utilities.handleErrors(invController.addClassification));

// Route to display the add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route to process the add inventory view
router.post("/add-inventory", validateInventory.inventoryRules(), validateInventory.checkInvData, utilities.handleErrors(invController.addInventory));

// Route for management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

module.exports = router;