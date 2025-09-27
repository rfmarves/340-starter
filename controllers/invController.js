const inventoryModel = require("../models/inventory-model")
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
  let className = ""
  let data = []
  let grid = ""
  let nav = await utilities.getNav()
  try {
    className = await inventoryModel.getClassificationNameById(classification_id)   
    data = await inventoryModel.getInventoryByClassificationId(classification_id)
    grid = await utilities.buildClassificationGrid(data)
      res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
  } catch (error) {
    console.error("Error fetching classification name: " + error)
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
}

/* ***************************
 *  Build inventory by InventoryId view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  let data = []
  let detail = ""
  let titleText = ""
  let nav = await utilities.getNav()
  try {
    data = await inventoryModel.getInventoryByInventoryId(inventory_id)
    detail = await utilities.buildInventoryDetail(data)
    titleText = data[0].inv_make + " " + data[0].inv_model
    res.render("./inventory/detail", {
      title: titleText,
      nav,
      detail,
      errors: null,
    })
  } catch (error) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
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

invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Classification addition
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const invClassificationResult = await inventoryModel.addClassification(
    classification_name
  )

  if (invClassificationResult) {
    req.flash(
      "notice",
      `The ${classification_name} has been added.`
    )
    nav = await utilities.getNav()
    res.status(201).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the classification couldn't be added.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}


invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelectList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationSelectList,
    errors: null,
  })
}

invCont.addInventory = async function (req, res, next) {}

module.exports = invCont