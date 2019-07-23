import Account from './account'
import Vote from './vote'

import { logErr } from '../debug'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

// password hash and salt are added automatically
const Comment = new Schema({
  userId: { type: ObjectId, required: true }, // email
  websiteId: { type: ObjectId, required: true },
  text: { type: String, required: true, maxlength: 2000 },
  parentId: { type: ObjectId }, // id field of parent comment
  replyTo: { type: ObjectId }, // id field of comment replied to
  score: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
}, {
  timestamps: true,
})

Comment.index({ websiteId: 1, parentId: 1 })
Comment.index({ websiteId: 1, score: -1 })
Comment.index({ websiteId: 1, createdAt: -1 })

Comment.on('error', err => logErr(err)) // backup

Comment.method('getScore', function(userId) {
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
Comment.method('getUser', function() {
  return Account.findOne({ _id: this.userId }).then(user => ({ displayName: user.displayName }))
})
Comment.method('getChildren', function(userId) {
  return this.constructor.find({ parentId: this._id }, null, {
    limit: 10,
    sort: {
      createdAt: -1
    }
  }).then(children => Promise.all(children.map(child => child.toObj(userId, false)))
    .then(children => ({ children }))
  )
})
Comment.method('toObj', function(userId, getChildren = true) {
  const promises = [this.getUser(), this.getScore(userId)]
  if (getChildren) promises.push(this.getChildren(userId))
  return Promise.all(promises)
    .then(objs => objs.reduce((acc, obj) => ({ ...acc, ...obj }), { ...this.toObject(), children: [] }))
})

const CommentModel = mongoose.model('Comment', Comment)

module.exports = CommentModel
