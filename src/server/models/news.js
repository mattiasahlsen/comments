const mongoose = require('mongoose')
const Schema = mongoose.Schema

// password hash and salt are added automatically
const News = new Schema({
  url: { type: String, required: true, index: true, unique: true },
  urlToImage: { type: String },
  title: { type: String },
  description: { type: String },
  publishedAt: { type: Date },
  visible: { type: Boolean, default: true }
  // domainWide: { type: Boolean, default: false },
}, {
  timestamps: true,
})
News.index({ createdAt: -1 })

module.exports = mongoose.model('News', News)
