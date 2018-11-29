const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

// password hash and salt are added automatically
const Comment = new Schema({
  username: { type: String, required: true }, // email
  websiteId: { type: ObjectId, required: true, index: true },
  text: { type: String, required: true },
  parentId: ObjectId, // id field of parent comment
  visible: { type: Boolean, default: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 }
}, {
  timestamps: true,
})

module.exports = mongoose.model('Comment', Comment)
