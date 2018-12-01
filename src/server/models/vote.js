const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

const Vote = new Schema({
  userId: { type: ObjectId, required: true }, // email
  commentId: { type: ObjectId, required: true, index: true },
  like: { type: Boolean, required: true } // true for like, false for dislike
})

const vote = function(model, like, userId, commentId, cb) {
  return model.findOneAndUpdate({ userId, commentId },
    { like }, { upsert: true, new: true }, cb)
}
Vote.statics.like = function(userId, commentId, cb) {
  vote(this, true, userId, commentId, cb)
}
Vote.statics.dislike = function(userId, commentId, cb) {
  vote(this, false, userId, commentId, cb)
}

Vote.index({ commentId: 1, userId: 1 }, { unique: true })

const VoteModel = mongoose.model('Vote', Vote)

export default VoteModel
