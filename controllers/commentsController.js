const commentsModel = require("../models/comments-model")
const utilities = require("../utilities/")

const commentsCont = {}

//**************************************************
//*  Build comments by InventoryId view 
//* ************************************************
commentsCont.buildByInventoryId = async function(req, res, next) {
  let nav = await utilities.getNav()
  const inventory_id = req.params.inventoryId
  let data = []
  let comments = ""
  try {
    data = await commentsModel.getCommentsByInvId(inventory_id)
    comments = await utilities.buildCommentsHtml(data)
    // return comments
    res.render("./comments/item-comments", {
      title: "Comments",
      nav,
      comments,
      errors: null,
    })
  } catch (error) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
}

module.exports = commentsCont