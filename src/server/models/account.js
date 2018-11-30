const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

// password hash and salt are added automatically
const Account = new Schema({
  username: { type: String, required: true, index: true, unique: true },
  displayName: { type: String, required: true },
  confirmed: { type: Boolean, default: false }, // Confirmed email address
  visible: { type: Boolean, default: true }
}, {
  timestamps: true,
})
Account.plugin(passportLocalMongoose)

const AccountModel = mongoose.model('Account', Account)

module.exports = AccountModel
