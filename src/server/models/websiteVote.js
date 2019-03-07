const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ObjectId = Schema.Types.ObjectId

const Vote = new Schema({
  userId: { type: ObjectId, required: true }, // email
  websiteId: { type: ObjectId, required: true, index: true },
  like: { type: Boolean, required: true }, // true for like, false for dislike
  credibility: { type: Boolean, required: true } // true if it's for credibility, false for "likeability"
})

const vote = function(model, like, cred, userId, commentId, cb) {
  return model.findOneAndUpdate({ userId, commentId },
    { like, cred }, { upsert: true }, cb)
}
Vote.statics.like = function(userId, websiteId, cb) {
  vote(this, true, false, userId, websiteId, cb)
}
Vote.statics.dislike = function(userId, websiteId, cb) {
  vote(this, false, false, userId, websiteId, cb)
}
Vote.statics.cred = function(userId, websiteId, cb) {
  vote(this, true, true, userId, websiteId, cb)
}
Vote.statics.discred = function(userId, websiteId, cb) {
  vote(this, false, true, userId, websiteId, cb)
}

Vote.index({ websiteId: 1, userId: 1, credibility: 1 }, { unique: true })

const VoteModel = mongoose.model('Vote', Vote)

export default VoteModel
