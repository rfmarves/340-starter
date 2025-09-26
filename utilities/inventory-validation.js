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
validateInventory.checkInvData = async (req, res, next) => {
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


module.exports = validateInventory