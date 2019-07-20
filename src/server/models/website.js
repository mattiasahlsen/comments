import Vote from './vote'
import News from './news'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// password hash and salt are added automatically
const Website = new Schema({
  url: { type: String, required: true, index: true, unique: true, maxlength: 200 },
  newsId: { type: Schema.Types.ObjectId, required: false },
  visible: { type: Boolean, default: true }
  // domainWide: { type: Boolean, default: false },
}, {
  timestamps: true,
})
Website.method('getNews', function() {
  return News.findById(this.newsId).then(news => ({ news }))
})
Website.method('getScore', function(userId) {
  return Vote.find({ objectId: this._id }).then(votes => {
    const obj = { likes: 0, dislikes: 0, hasLiked: false, hasDisliked: false }
    votes.forEach(vote => {
      if (vote.like) obj.likes++
      else obj.dislikes++
      if (vote.userId.equals(userId)) {
        if (vote.like) obj.hasLiked = true
        else obj.hasDisliked = true
      }
    })
    return obj
  })
})
Website.method('toObj', function(userId) {
  const out = Promise.all([this.getScore(userId), this.getNews()])
    .then(objs => objs.reduce((acc, obj) => ({ ...acc, ...obj }), this.toObject()))
  return out
})

Website.index({ createdAt: -1 })

module.exports = mongoose.model('Website', Website)
