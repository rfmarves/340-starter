const utilities = require("../utilities")
const {body, validationResult} = require("express-validator")
const inventoryModel = require("../models/inventory-model")

const validateInventory = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validateInventory.classificationRules = () => {
    return [
      // valid classsification name is required and cannot already exist in the DB
      body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a classification name.")
      .custom(async (classification_name) => {
        const classificationExists = await inventoryModel.checkClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification already exists.")
        }
      }),
    ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validateInventory.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

validateInventory.inventoryRules = (req, res, next) => {
    return [
      // inv_make validation rules
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the vehicle make."), // on error this message is sent.
 
      // inv_model validation rules
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the vehicle model."), // on error this message is sent.
 
      // inv_description validation rules
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 10 })
        .withMessage("Please provide the vehicle description."), // on error this message is sent.
 
      // inv_image validation rules
      body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the vehicle image."), // on error this message is sent.
 
      // inv_thumbnail validation rules
      body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the vehicle thumbnail image."), // on error this message is sent.
 
      // inv_price validation rules
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isDecimal()
        .withMessage("Please provide the vehicle price."), // on error this message is sent.

      // inv_year validation rules
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please provide the vehicle year."), // on error this message is sent.

      // inv_miles validation rules
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please provide the vehicle miles."), // on error this message is sent.

      // inv_color validation rules
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the vehicle color."), // on error this message is sent.

      // classification_id validation rules
      body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid classification is needed.")
      .custom(async (classification_id) => {
        const classificationExists = await inventoryModel.checkClassificationById(classification_id)
        if (!classificationExists){
          throw new Error("Classification does not exist.")
        }
      }),

    ]
}
validateInventory.checkInvData = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelectList = await utilities.buildClassificationList(classification_id)
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationSelectList,
      inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color,
      errors,
    })
    return
  }
  next()
}

module.exports = validateInventory