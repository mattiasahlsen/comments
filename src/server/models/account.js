const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

// password hash and salt are added automatically
const Account = new Schema({
  username: String, // email
}, {
  timestamps: true,
})

Account.plugin(passportLocalMongoose)

module.exports = mongoose.model('Account', Account)
