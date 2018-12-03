const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

// password hash and salt are added automatically
const Account = new Schema({
  username: { type: String, required: true }, // email
  confirmed: { type: Boolean, default: false }, // Confirmed email address
  visible: { type: Boolean, default: true },
})

Account.plugin(passportLocalMongoose)

module.exports = mongoose.model('Account', Account)
