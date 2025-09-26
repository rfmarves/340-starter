const pool = require("../database/")

inventoryModel = {}

/* ***************************
 *  Get all classification data
 * ************************** */
inventoryModel.getClassifications = async function(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
inventoryModel.getInventoryByClassificationId = async function(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get data for one item based on inv_id
 * ************************** */
inventoryModel.getInventoryByInventoryId = async function(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
inventoryModel.checkClassification = async function(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE LOWER(classification_name) = LOWER($1)"
    const classificationList = await pool.query(sql, [classification_name])
    return classificationList.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Add a new classification
* *************************** */
inventoryModel.addClassification = async function(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

module.exports = inventoryModel