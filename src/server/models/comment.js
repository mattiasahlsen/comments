const mongoose = require('mongoose')
const Schema = mongoose.Schema

// password hash and salt are added automatically
const Comment = new Schema({
  username: String, // email
  url: String,
  text: String,
  parent: String, // _id field of parent comment, comment it's a reply to
}, {
  timestamps: true,
})

module.exports = mongoose.model('Comment', Comment)
