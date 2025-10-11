const { render } = require("ejs")
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
      reviewList += `<a href="/review/new/${inv_id}">Write a review</a>`
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
  const inv_id = req.params.inv_id
  const invObject = await inventoryModel.getInventoryByInventoryId(inv_id)
  const invData = invObject[0]
  const account_id = res.locals.accountData.account_id
  const title = `Review for ${invData.inv_year} ${invData.inv_make} ${invData.inv_model}:`
  res.render("./reviews/new-review", {
    title: title,
    nav,
    inv_id,
    account_id,
    actionRoute: "/review/new",
    buttonName: "Add",
    errors: null,
    message: null,
    notice: null,
  })
}

//***********************************************************
//*  Post a new review 
//***********************************************************
reviewsCont.createReviewPost = async function(req, res, next) {
  const nav = await utilities.getNav()
  const { review_text, inv_id, account_id } = req.body
  const addReviewResult = await reviewsModel.addReview(review_text, inv_id, account_id)
  if(addReviewResult) {
    req.flash("message", "Review created successfully.")
    return res.redirect(`/inv/detail/${inv_id}`)
  } else {
    const invObject = await inventoryModel.getInventoryByInventoryId(inv_id)
    const invData = invObject[0]
    const title = `Review for ${invData.inv_year} ${invData.inv_make} ${invData.inv_model}:`
    console.log("path for review not added")
    res.status(501).render("./reviews/new-review", {
      title: title,
      nav,
      actionRoute: "/review/new",
      buttonName: "Add",
      message: null,
      notice: null,
      errors: [{msg: "Failed to add review."}],
      ...req.body,})
  }
}

//***********************************************************
//*  Edit a review 
//***********************************************************
reviewsCont.editReviewView = async function(req, res, next) {
  const nav = await utilities.getNav()
  const review_id = req.params.review_id
  const dataList = await reviewsModel.getReviewById(review_id)
  const data = dataList[0]
  const title = `Edit review for ${data.inv_year} ${data.inv_make} ${data.inv_model}:`
  const referrerPage = req.get('Referer')
  req.session.returnTo = referrerPage
  req.session.review_id = review_id
  res.render("./reviews/new-review", {
    title: title,
    nav,
    actionRoute: "/review/edit",
    buttonName: "Update",
    inv_id: data.inv_id,
    account_id: data.account_id,
    review_text: data.review_text,
    errors: null,
    message: null,
    notice: null,
  })
}

//***********************************************************
//*  Post review update
//***********************************************************
reviewsCont.editReviewUpdate = async function(req, res, next) {
  const nav = await utilities.getNav()
  const { review_text, inv_id } = req.body
  const review_id = req.session.review_id
  const redirectTo = req.session.returnTo || `/inv/detail/${inv_id}`
  const updateReviewResult = await reviewsModel.updateReview(review_id, review_text)
  if(updateReviewResult) {
    req.flash("message", "Review updated successfully.")
    delete req.session.review_id
    return res.redirect(redirectTo)
  } else {
    const invObject = await inventoryModel.getInventoryByInventoryId(inv_id)
    const invData = invObject[0]
    const title = `Edit review for ${invData.inv_year} ${invData.inv_make} ${invData.inv_model}:`
    console.log("path for review not edited")
    res.status(501).render("./reviews/new-review", {
      title: title,
      nav,
      actionRoute: "/review/edit",
      buttonName: "Update",
      message: null,
      notice: null,
      errors: [{msg: "Failed to add review."}],
      ...req.body,})
  }
}

//***********************************************************
//*  Delete a review 
//***********************************************************
reviewsCont.deleteReviewView = async function(req, res, next) {}
reviewsCont.deleteReviewCommit = async function(req, res, next) {}

module.exports = reviewsCont