const mongoose = require('mongoose')
const Schema = mongoose.Schema

// password hash and salt are added automatically
const Website = new Schema({
  id: Number,
  url: String,
  domainWide: Boolean,
  visible: Boolean
}, {
  timestamps: true,
})

module.exports = mongoose.model('Website', Website)
