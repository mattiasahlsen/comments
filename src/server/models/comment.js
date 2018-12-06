import Account from './account'
import Website from './website'
import Vote from './vote'
import { idValidator } from './validators'

import { logErr } from '../debug'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

// password hash and salt are added automatically
const Comment = new Schema({
  userId: { type: ObjectId, required: true }, // email
  websiteId: { type: ObjectId, required: true, index: true },
  text: { type: String, required: true },
  parentId: { type: ObjectId }, // id field of parent comment
  visible: { type: Boolean, default: true },
}, {
  timestamps: true,
})

Comment.on('error', err => logErr(err)) // backup

Comment.method('getScore', function(userId) {
  return new Promise((resolve, reject) => {
    Vote.find({ commentId: this._id }, (err, votes) => {
      if (err) reject(err)
      this.score = 0
      this.hasLiked = this.hasDisliked = false

      for (let i = 0; i < votes.length; i++) {
        if (votes[i].like) this.score++
        else this.score--

        if (votes[i].userId.equals(userId)) {
          if (votes[i].like) this.hasLiked = true
          else this.hasDisliked = true
        }
      }
      resolve()
    })
  })
})
Comment.method('getUser', function() {
  return new Promise((resolve, reject) => {
    Account.findOne({ _id: this.userId }, (err, user) => {
      if (err) reject(err)

      this.user = user
      resolve(user)
    })
  })
})
Comment.method('fetchAll', function(userId) {
  return new Promise((resolve, reject) => {
    let gotScore = false
    let gotUser = false
    this.getUser().then(() => {
      gotUser = true
      if (gotScore) resolve(this)
    }).catch(err => reject(err))
    this.getScore(userId).then(() => {
      gotScore = true
      if (gotUser) resolve(this)
    }).catch(err => reject(err))
  })
})
Comment.method('toObj', function(userId) {
  return this.fetchAll(userId).then(() => {
    const obj = this.toObject()
    obj.score = this.score
    obj.displayName = this.user.displayName
    obj.hasLiked = this.hasLiked
    obj.hasDisliked = this.hasDisliked
    return obj
  })
})

const CommentModel = mongoose.model('Comment', Comment)

Comment.path('userId').validate(idValidator(Account))
Comment.path('websiteId').validate(idValidator(Website))
Comment.path('parentId').validate(idValidator(CommentModel))

module.exports = CommentModel
