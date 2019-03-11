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
  text: { type: String, required: true, maxlength: 1000 },
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

Comment.method('getScore', function(obj, userId) {
  return new Promise((resolve, reject) => {
    Vote.find({ commentId: this._id }, (err, votes) => {
      if (err) reject(err)
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
      resolve()
    })
  })
})
Comment.method('getUser', function(obj) {
  return new Promise((resolve, reject) => {
    Account.findOne({ _id: this.userId }, (err, user) => {
      if (err) reject(err)

      obj.displayName = user.displayName
      resolve(user)
    })
  })
})
Comment.method('getChildren', function(obj, userId, offset = 0) {
  return new Promise((resolve, reject) => {
    this.constructor.find({ parentId: this._id }, null, {
      limit: 10,
      skip: offset,
      sort: {
        createdAt: -1
      }
    }, (err, comments) => {
      if (err) reject(err)

      if (comments.length === 0) return resolve([])

      let count = 0
      for (let i = 0; i < comments.length; i++) {
        comments[i].toObj(userId, false).then(comment => {
          obj.children.push(comment)
          if (++count === comments.length) {
            resolve(comments)
          }
        }).catch(err => reject(err))
      }
    })
  })
})
Comment.method('fetchAll', function(userId, hasChildren) {
  return new Promise((resolve, reject) => {
    const obj = {}
    obj.children = []

    let gotScore = false
    let gotUser = false
    let gotChildren = !hasChildren

    this.getUser(obj).then(() => {
      gotUser = true
      if (gotScore && gotChildren) resolve(obj)
    }).catch(err => reject(err))
    this.getScore(obj, userId).then(() => {
      gotScore = true
      if (gotUser && gotChildren) resolve(obj)
    }).catch(err => reject(err))
    if (hasChildren) {
      this.getChildren(obj, userId).then(() => {
        gotChildren = true
        if (gotScore && gotUser) resolve(obj)
      }).catch(err => reject(err))
    }
  })
})
Comment.method('toObj', function(userId, hasChildren = true) {
  return this.fetchAll(userId, hasChildren).then(obj => {
    return Object.assign(this.toObject(), obj)
  })
})

const CommentModel = mongoose.model('Comment', Comment)

module.exports = CommentModel
