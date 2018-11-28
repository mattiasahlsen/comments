const mongoose = require('mongoose')
const Schema = mongoose.Schema

// password hash and salt are added automatically
const Comment = new Schema({
  id: Number,
  username: String, // email
  websiteId: Number,
  text: String,
  parent: Number, // _id field of parent comment, comment it's a reply to
  visible: Boolean
}, {
  timestamps: true,
})

module.exports = mongoose.model('Comment', Comment)
