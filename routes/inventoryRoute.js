// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by InventoryId view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// trigger an error
router.get("/unknown", invController.forcedError);

module.exports = router;