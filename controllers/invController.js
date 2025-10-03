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
  const nav = await utilities.getNav()
  let errors = req.flash("error")
  let message = req.flash("message")
  let notice = req.flash("notice")
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: errors.length > 0 ? errors : null,
    message: message.length > 0 ? message : null,
    notice: notice.length > 0 ? notice : null,
    classificationSelect,
  })
}

invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let message = req.flash("message")
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: null,
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
    let message = `"${classification_name}" has been added to classifications.`
    nav = await utilities.getNav()
    // const message = req.flash("message")
    // res.redirect("/inv/add-classification")
    res.status(201).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message,
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

/* ***************************
 *  Add new inventory item
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const imgPath = ""
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body
  const invAddResult = await inventoryModel.addInventory(
    inv_make, inv_model, inv_description, imgPath + inv_image, imgPath + inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id
  )
  if(invAddResult) {
    req.flash("message", `Vehicle added successfully.`)
    res.redirect("/inv")
  } else {
    console.log("path for inventory not added")
    let classificationSelectList = await utilities.buildClassificationList(classification_id)
    // req.flash("error", "Sorry, the vehicle couldn't be added.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationSelectList,
      errors: [{ msg: "Failed to add inventory item." }],
      ...req.body,    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await inventoryModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Edit existing inventory item
 * ************************** */
invCont.buildEditInventoryView = async (req, res, next) => {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemDataArray = await inventoryModel.getInventoryByInventoryId(inv_id)
  const itemData = itemDataArray[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelectList: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color
  })
}

/* ***************************
 *  Update inventory item
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const imgPath = ""
  const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body
  const updateResult = await inventoryModel.updateInventory(
    inv_id, inv_make, inv_model, inv_description, imgPath + inv_image, imgPath + inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id
  )
  if(updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv")
  } else {
    console.log("path for inventory not updated")
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    let classificationSelectList = await utilities.buildClassificationList(classification_id)
    res.status(501).render("/inv/edit-inventory/", {
      title: "Edit" + itemName,
      nav,
      classificationSelectList,
      errors: [{ msg: "Failed to add inventory item." }],
      ...req.body,    })
  }
}

/* ***************************
 *  Inventory item  Delete confirmation view
 * ************************** */
invCont.buildDeleteInventoryView = async (req, res, next) => {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemDataArray = await inventoryModel.getInventoryByInventoryId(inv_id)
  const itemData = itemDataArray[0]
  const classificationName = await inventoryModel.getClassificationNameById(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Confirm deletion of " + itemName,
    nav,
    classificationName: classificationName,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color
  })
}

/* ***************************
 *  Delete inventory item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const { inv_id } = req.body
  const deleteItemResult = await inventoryModel.deleteInventory( inv_id )
  if(deleteItemResult) {
    req.flash("notice", `The vehicle was successfully deleted.`)
    res.redirect("/inv")
  } else {
    console.log("path for inventory not deleted")
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("/inv")
  }
}

module.exports = invCont