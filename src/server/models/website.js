const mongoose = require('mongoose')
const Schema = mongoose.Schema

// password hash and salt are added automatically
const Website = new Schema({
  url: { type: String, required: true, index: true, unique: true },
  domainWide: { type: Boolean, default: false },
  visible: { type: Boolean, default: true }
}, {
  timestamps: true,
})

Website.index({ createdAt: -1 })

module.exports = mongoose.model('Website', Website)
