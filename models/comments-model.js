const pool = require("../database/")

commentsModel = {}

// ****************************************************************************
//  Gets all comments for displaying in detailed inventory view
// ****************************************************************************
commentsModel.getCommentsByInvId = async function(inv_id) {
  try {
    const data = await pool.query(
      `SELECT c.comment_id, c.comment_text, c.comment_date, i.inv_id, a.account_id, a.account_firstname FROM public.comments AS c
      JOIN public.inventory AS i
      ON c.inv_id = i.inv_id 
      JOIN public.account AS a
      ON c.account_id = a.account_id
      WHERE c.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getCommentsByInvId error " + error)
    return error.message
  }
}

// ****************************************************************************
//  Gets all coments for displaying in account management view
// ****************************************************************************
commentsModel.getCommentsByAccountId = async function(account_id) {
  try {
    const data = await pool.query(
      `SELECT c.comment_id, c.comment_date, i.inv_id, a.account_id, i.inv_year, i.inv_make, i.inv_model FROM public.comments AS c
      JOIN public.inventory AS i
      ON c.inv_id = i.inv_id 
      JOIN public.account AS a
      ON c.account_id = a.account_id
      WHERE a.account_id = $1`,
      [account_id]
    )
    return data.rows
  } catch (error) {
    console.error("getCommentsByAccountId error " + error)
    return error.message
  }
}

// ****************************************************************************
//  Gets data from one comment based on comment_id
// ****************************************************************************
commentsModel.getCommentById = async function(comment_id) {
  try {
    const data = await pool.query(
      `SELECT c.comment_id, c.comment_text, c.comment_date, i.inv_id, i.inv_year, i.inv_make, i.inv_model FROM public.comments AS c
      JOIN public.inventory AS i
      ON c.inv_id = i.inv_id 
      JOIN public.account AS a
      ON c.account_id = a.account_id
      WHERE c.inv_id = $1`,
      [comment_id]
    )
    return data.rows
  } catch (error) {
    console.error("getCommentById error " + error)
    return error.message
  }
}

// ****************************************************************************
//  Adds a new comment
// ****************************************************************************
commentsModel.addComment = async function(comment_text, inv_id, account_id) {
  try {
    const sql = `INSERT INTO comments (comment_text, account_id, inv_id) 
                  VALUES ($1, $2, $3) RETURNING *`
    return await pool.query(sql, [comment_text, inv_id, account_id])
  } catch (error) {
    console.error("addComment error " + error)
    return error.message
  }
}

// ****************************************************************************
//  Updates a comment text
// ****************************************************************************
commentsModel.updateComment = async function(comment_id, comment_text) {
  try {
    const sql = `UPDATE public.comments SET comment_text = $1 
                  WHERE comment_text = $2 RETURNING *`
    return await pool.query(sql, [comment_text,comment_id])
  } catch (error) {
    console.error("updateComment: " + error)
    return error.message
  }
}

// ****************************************************************************
//  Deletes a comment based on comment_id
// ****************************************************************************
commentsModel.deleteComment = async function(comment_id) {
  try {
    const sql = `DELETE FROM public.comments WHERE comment_id = $1`
    const data = await pool.query(sql, [comment_id])
    return data
  } catch (error) {
    console.error("deleteComment error: " + error)
    return error.message
  }
}

module.exports = commentsModel