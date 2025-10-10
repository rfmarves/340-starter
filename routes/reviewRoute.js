// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewsController = require("../controllers/reviewsController")
const utilities = require("../utilities")

// Route to view comments for inventory item
router.get("/:inv_id", reviewsController.buildByInventoryId);
// router.get("/:inventoryId", console.log("this executed"));

// Route to create a review
router.get("/new/:inv_id", reviewsController.createReviewInput);

// Route to post a new review
router.post("/new/", reviewsController.createReviewPost);

// Route to view for editing a review
router.get("/edit/:inv_id", reviewsController.editReviewView);

// Route to update review
router.post("/edit/", reviewsController.editReviewUpdate);

// Route to confirm deletion of a review
router.get("/delete/:review_id", reviewsController.deleteReviewView);

// Route to delete a review
router.post("/delete/", reviewsController.deleteReviewCommit);

module.exports = router;