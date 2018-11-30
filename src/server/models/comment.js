import Account from './account'
import Website from './website'
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
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 }
}, {
  timestamps: true,
})
const CommentModel = mongoose.model('Comment', Comment)

Comment.path('userId').validate(idValidator(Account))
Comment.path('websiteId').validate(idValidator(Website))
Comment.path('parentId').validate(idValidator(CommentModel))

Comment.on('error', err => logErr(err)) // backup

module.exports = CommentModel
