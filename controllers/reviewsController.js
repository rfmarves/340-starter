const reviewsModel = require("../models/reviews-model")
const utilities = require("../utilities")

const reviewsCont = {}

//**************************************************
//*  Build reviews by InventoryId view 
//**************************************************
reviewsCont.buildByInventoryId = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const inventory_id = req.params.inventoryId
    let reviewList = await this.buildReviewHtmlSegment(inventory_id)
    res.render("./reviews/item-reviews", {
      title: "Reviews",
      nav,
      reviewList,
      errors: null,
    })
  } catch (error) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
}

//***********************************************************
//*  Build reviews by InventoryId to embed in Inventory view 
//***********************************************************
reviewsCont.buildReviewHtmlSegment = async function(inventory_id, account_id) {
  try {
    let data
    let reviewList = '<div id="reviewList">'
    let reviewWritten = false
    data = await reviewsModel.getReviewsByInvId(inventory_id)
    if(data.length > 0){
        data.forEach(review => { 
        reviewList += '<div class="review">'
        reviewList +=  '<div class="reviewHeader"><span class="reviewer">'
        reviewList += review.account_firstname 
        reviewList += '</span> wrote on ' 
        reviewList += new Intl.DateTimeFormat('en-US').format(review.review_date)
        if(account_id === review.account_id) {
          reviewList += ' (<a href="/review/edit/'+ review.review_id + '">Edit</a>)'
          reviewWritten = true
        }
        reviewList += '</div><div class="commentText">'
        reviewList += review.review_text
        reviewList += '</div></div>'
        })
    } else { 
        reviewList += '<div class="noReviews">Be the first one to leave a review.</div>'
    }
  reviewList += '</div><div class="postReviews">'
  if(account_id === null) {
    reviewList += 'You must <a href="/account/login">login</a> to write a review.'
  } else {
    if (reviewWritten) {
      reviewList += 'Thank you for writing a review for this item!'
    } else {
      reviewList += '<a href="/review/new/' + inventory_id + '>Write a review</a>'
    }
  }
  reviewList += '</div>'
  return reviewList
  } catch (error) {
    var err = new Error('Not Found');
    err.status = 404;
    return err
  }
}

module.exports = reviewsCont