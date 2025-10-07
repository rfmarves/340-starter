// Needed Resources 
const express = require("express")
const router = new express.Router() 
const commentsController = require("../controllers/commentsController")
const utilities = require("../utilities/")

// Route to view comments for inventory item
router.get("/:inventoryId", commentsController.buildByInventoryId);



module.exports = router;