const reviewsModel = require("../models/reviews-model")
const utilities = require("../utilities")

const reviewsCont = {}

//**************************************************
//*  Build reviews by InventoryId view 
//**************************************************
reviewsCont.buildByInventoryId = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const inventory_id = req.params.inv_id
    let account_id = null
    if (res.locals.loggedin) {
      account_id = res.locals.accountData.account_id
    }
    let reviewList = await this.buildReviewHtmlSegment(inventory_id, account_id)
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
reviewsCont.buildReviewHtmlSegment = async function(inv_id, account_id) {
  try {
    let data
    let reviewList = '<div id="reviewList">'
    let reviewWritten = false
    data = await reviewsModel.getReviewsByInvId(inv_id)
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
      reviewList += '<a href="/review/new/' + inv_id + '>Write a review</a>'
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

//***********************************************************
//*  Build reviews by AccountId to embed in Account Management view 
//***********************************************************
reviewsCont.buildReviewListByUserHtmlSegment = async function(account_id) {
  try {
    let data
    let reviewList = '<ol class="userReviews">'
    data = await reviewsModel.getReviewsByAccountId(account_id)
    if(data.length > 0){
        data.forEach(review => { 
        reviewList += '<li class="review"> Reviewed '
        reviewList += review.inv_year + ' ' 
        reviewList += review.inv_make + ' ' + review.inv_model + ' on '
        reviewList += new Intl.DateTimeFormat('en-US').format(review.review_date)
        reviewList += ` <a href="/review/edit/${review.review_id}">Edit</a>`
        reviewList += ` | <a href="/review/delete/${review.review_id}">Delete</a>`
        reviewList += '</li>'
        })
    } else { 
        reviewList += '<li class="review">You haven\'t written any reviews yet.</div>'
    }
  reviewList += '</ol>'
  return reviewList
  } catch (error) {
    var err = new Error('Not Found');
    err.status = 404;
    return err
  }
}

//***********************************************************
//*  Create a review 
//***********************************************************
reviewsCont.createReviewInput = async function(req, res, next) {
    const nav = await utilities.getNav()
    const inventory_id = req.params.inv_id
    const account_id = res.locals.accountData.account_id
}
reviewsCont.createReviewPost = async function(req, res, next) {}

//***********************************************************
//*  Edit a review 
//***********************************************************
reviewsCont.editReviewView = async function(req, res, next) {}
reviewsCont.editReviewUpdate = async function(req, res, next) {}

//***********************************************************
//*  Delete a review 
//***********************************************************
reviewsCont.deleteReviewView = async function(req, res, next) {}
reviewsCont.deleteReviewCommit = async function(req, res, next) {}

module.exports = reviewsCont