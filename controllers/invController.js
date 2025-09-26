const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

function isNumeric(str) {
  return /^\d+$/.test(str); // Matches only digits (0-9)
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  let data = []
  let grid = ""
  if (isNumeric(classification_id) === false) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
  } else {
    data = await invModel.getInventoryByClassificationId(classification_id)
    grid = await utilities.buildClassificationGrid(data)
  }
  let nav = await utilities.getNav()
  let className = ""
  if (data.length < 1) {
    className = "Classification does not exist"
  } else {
    className = data[0].classification_name
  }
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory by InventoryId view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  let data = []
  let detail = ""
  if (isNumeric(inventory_id) === false) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
  } else {
    data = await invModel.getInventoryByInventoryId(inventory_id)
    detail = await utilities.buildInventoryDetail(data)
  }
  let nav = await utilities.getNav()
  let titleText = ""
  if (data.length < 1) {
    titleText = "No vehicle found"
  } else {
    titleText = data[0].inv_make + " " + data[0].inv_model
  }
  res.render("./inventory/detail", {
    title: titleText,
    nav,
    detail,
    errors: null,
  })
}

invCont.forcedError = (req, res, next) => {
    let err = new Error("Wow! Congratulations! You found a server error!")
    err.status = 500
  next(err)
}

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let links = '<ul class="management"><li><a href="/inv/add-classification">Add New Classification</a></li><li><a href="/inv/add-inventory">Add New Vehicle</a></li></ul>'
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    links,
    errors: null,
  })
}

module.exports = invCont