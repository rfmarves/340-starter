const pool = require("../database/")

inventoryModel = {}

/* ***************************
 *  Get all classification data
 * ************************** */
inventoryModel.getClassifications = async function(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get classification name by id
 * ************************** */
inventoryModel.getClassificationNameById = async function(classification_id) {
  try {
    const data = await pool.query("SELECT classification_name FROM public.classification WHERE classification_id = $1", [classification_id])
    return data.rows[0].classification_name
  } catch (error) {
    console.error("Classification doesn't exist.")
    var err = new Error("Classification doesn't exist.");
    err.status = 404;
    next(err);
  }
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
 *   Check for existing classification by name
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

/* **********************
 *   Check for existing classification by ID
 * ********************* */
inventoryModel.checkClassificationById = async function(classification_id){
  try {
    const sql = "SELECT * FROM classification WHERE classification_id = $1"
    const classificationList = await pool.query(sql, [classification_id])
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

/* *****************************
*   Add a new Vehicle to inventory
* *************************** */
inventoryModel.addInventory = async function(inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id){
  try {
    const sql = `INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Update a  Vehicle in inventory
* *************************** */
inventoryModel.updateInventory = async function(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id){
  try {
    const sql = `UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 
                  WHERE inv_id = $11 RETURNING *`
    return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
  } catch (error) {
    console.error("model error: " + error)
    return error.message
  }
}

/* *****************************
*   Delete a  Vehicle in inventory
* *************************** */
inventoryModel.deleteInventory = async function(inv_id){
  try {
    const sql = `DELETE FROM public.inventory WHERE inv_id = $1`
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("model error: " + error)
    new Error("Delete Inventory Error")
  }
}

module.exports = inventoryModel