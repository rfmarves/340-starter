const pool = require("../database")

reviewsModel = {}

// ****************************************************************************
//  Gets all reviews for displaying in detailed inventory view
// ****************************************************************************
reviewsModel.getReviewsByInvId = async function(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_date, i.inv_id, a.account_id, a.account_firstname FROM public.reviews AS r
      JOIN public.inventory AS i
      ON r.inv_id = i.inv_id 
      JOIN public.account AS a
      ON r.account_id = a.account_id
      WHERE r.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getReviewsByInvId error " + error)
    return error.message
  }
}

// ****************************************************************************
//  Gets all reviews for displaying in account management view
// ****************************************************************************
reviewsModel.getReviewsByAccountId = async function(account_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_id, r.review_date, i.inv_id, a.account_id, i.inv_year, i.inv_make, i.inv_model FROM public.reviews AS r
      JOIN public.inventory AS i
      ON r.inv_id = i.inv_id 
      JOIN public.account AS a
      ON r.account_id = a.account_id
      WHERE r.account_id = $1`,
      [account_id]
    )
    console.log(data.rows)
    return data.rows
  } catch (error) {
    console.error("getReviewsByAccountId error " + error)
    return error.message
  }
}

// ****************************************************************************
//  Gets data from one review based on review_id
// ****************************************************************************
reviewsModel.getReviewById = async function(review_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_id, r.review_text, r.review_date, i.inv_id, i.inv_year, i.inv_make, i.inv_model FROM public.reviews AS r
      JOIN public.inventory AS i
      ON r.inv_id = i.inv_id 
      JOIN public.account AS a
      ON r.account_id = a.account_id
      WHERE r.inv_id = $1`,
      [review_id]
    )
    return data.rows
  } catch (error) {
    console.error("getReviewById error " + error)
    return error.message
  }
}

// ****************************************************************************
//  Adds a new review
// ****************************************************************************
reviewsModel.addReview = async function(review_text, inv_id, account_id) {
  try {
    const sql = `INSERT INTO reviews (review_text, inv_id, account_id) 
                  VALUES ($1, $2, $3) RETURNING *`
    return await pool.query(sql, [review_text, inv_id, account_id])
  } catch (error) {
    console.error("addReview error " + error)
    return error.message
  }
}

// ****************************************************************************
//  Updates a review text
// ****************************************************************************
reviewsModel.updateReview = async function(comment_id, comment_text) {
  try {
    const sql = `UPDATE public.reviews SET review_text = $1 
                  WHERE review_id = $2 RETURNING *`
    return await pool.query(sql, [review_text,review_id])
  } catch (error) {
    console.error("updateReview: " + error)
    return error.message
  }
}

// ****************************************************************************
//  Deletes a review based on comment_id
// ****************************************************************************
reviewsModel.deleteReview = async function(review_id) {
  try {
    const sql = `DELETE FROM public.reviews WHERE review_id = $1`
    const data = await pool.query(sql, [review_id])
    return data
  } catch (error) {
    console.error("deleteReview error: " + error)
    return error.message
  }
}

module.exports = reviewsModel