const pool = require("../database/")

const accountModel = {}

/* *****************************
*   Register new account
* *************************** */
accountModel.registerAccount = async function(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
accountModel.checkExistingEmail = async function(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
accountModel.getAccountByEmail = async function(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account_id
* ***************************** */
accountModel.getAccountById = async function(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [Number(account_id)])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching id found")
  }
}

/* *****************************
*   Update account information
* *************************** */
accountModel.updateAccountData = async function(account_id, account_firstname, account_lastname, account_email){
  try {
    const sql = `UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3
                 WHERE account_id = $4 RETURNING *`
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Update account password
* *************************** */
accountModel.updateAccountPassword = async function(account_id, account_password){
  try {
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    return await pool.query(sql, [account_password, Number(account_id)])
  } catch (error) {
    return error.message
  }
}

module.exports = accountModel