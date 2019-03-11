const mongoose = require('mongoose')
const Schema = mongoose.Schema

// password hash and salt are added automatically
const Website = new Schema({
  url: { type: String, required: true, index: true, unique: true, maxlength: 200 },
  visible: { type: Boolean, default: true }
  // domainWide: { type: Boolean, default: false },
}, {
  timestamps: true,
})

Website.index({ createdAt: -1 })

module.exports = mongoose.model('Website', Website)
