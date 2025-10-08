// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewsController = require("../controllers/reviewsController")
const utilities = require("../utilities")

// Route to view comments for inventory item
router.get("/:inventoryId", reviewsController.buildByInventoryId);
// router.get("/:inventoryId", console.log("this executed"));


module.exports = router;