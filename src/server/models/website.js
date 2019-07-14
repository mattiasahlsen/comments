import Vote from './vote'

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
Website.method('getScore', function(userId) {
  return new Promise((resolve, reject) => {
    Vote.find({ objectId: this._id }, (err, votes) => {
      if (err) reject(err)

      const obj = {}
      obj.likes = 0
      obj.dislikes = 0
      obj.hasLiked = obj.hasDisliked = false

      for (let i = 0; i < votes.length; i++) {
        if (votes[i].like) obj.likes++
        else obj.dislikes++

        if (votes[i].userId.equals(userId)) {
          if (votes[i].like) obj.hasLiked = true
          else obj.hasDisliked = true
        }
      }
      resolve(obj)
    })
  })
})
Website.method('toObj', function(userId) {
  return this.getScore(userId).then(obj => {
    return Object.assign(this.toObject(), obj)
  })
})

Website.index({ createdAt: -1 })

module.exports = mongoose.model('Website', Website)
