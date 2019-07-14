const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

const Vote = new Schema({
  // website id or comment id
  objectId: { type: ObjectId, required: true, index: true },
  userId: { type: ObjectId, required: true }, // email
  like: { type: Boolean, required: true }, // true for like, false for dislike
  credibility: { type: Boolean, default: false } // true if it's for credibility, false for likeability
})

const vote = function(model, like, userId, objectId, cb) {
  return model.findOneAndUpdate({ userId, objectId },
    { like }, { upsert: true }, cb)
}
Vote.statics.like = function(userId, objectId, cb) {
  vote(this, true, userId, objectId, cb)
}
Vote.statics.dislike = function(userId, objectId, cb) {
  vote(this, false, userId, objectId, cb)
}

Vote.index({ objectId: 1, userId: 1 }, { unique: true })

const VoteModel = mongoose.model('Vote', Vote)

export default VoteModel
