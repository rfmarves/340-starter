const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accCont.registerAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accCont.accountLogin = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver Account Management view
* *************************************** */
accCont.buildAccountManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    notice: null,
    message: null,
  })
}

/* ****************************************
*  Deliver Update Account Information view
* *************************************** */
accCont.buildAccountUpdate = async function (req, res, next) {
  const nav = await utilities.getNav()
  const account_id        = res.locals.accountData.account_id
  const account_firstname = res.locals.accountData.account_firstname
  const account_lastname  = res.locals.accountData.account_lastname
  const account_email     = res.locals.accountData.account_email
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    errors: null,
    notice: null,
    message: null,
  })
}

/* ****************************************
*  Process Update Account Information
* *************************************** */
accCont.updateAccountData = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccountData(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, ${account_firstname}, your account has been updated.`
    )
    console.log("updating access token.")
    const accountData = await accountModel.getAccountById(account_id)
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    if(process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    // return res.redirect("/account/")
    res.status(201).redirect("/account/update")
  } else {
    req.flash("error", "Sorry, the registration failed.")
    res.status(501).redirect("/account/update")
  }
}

accCont.updateAccountPassword = async function(req, res) {}

accCont.logout = async function(req, res) {}

module.exports = accCont