import logger, { debug, logErr } from '../debug'
import conf from '../../config'

import Vote from '../models/vote'

const log = logger.log // logging function

const Website = require('../models/website')
const Comment = require('../models/comment')
const Account = require('../models/account')

const express = require('express')

const router = express.Router()

// All these routes must belong to a url (Website)
router.use('/comments/:url/*', (req, res, next) => {
  Website.findOne({ url: req.params.url }, (err, website) => {
    if (err || !website) {
      if (err) {
        logErr(err)
        return res.status(500).end()
      }
      return res.status(404).end()
    }

    req.website = website
    next()
  })
})
router.use('/comment/:id/*', (req, res, next) => {
  Comment.findById(req.params.id, (err, comment) => {
    if (err || !comment) {
      if (err) {
        logErr(err)
        return res.status(500).end()
      }
      debug('Didn\'t find comment.')
      return res.status(404).end()
    }
    req.comment = comment
    next()
  })
})

router.get(['/comments/:url/:sort/:offset?'], (req, res) => {
  const website = req.website
  const offset = parseInt(req.params.offset) || 0
  const sortMethods = ['hot', 'score', 'new']
  let parentId
  let sort
  if (sortMethods.includes(req.params.sort)) sort = req.params.sort
  else parentId = req.params.sort

  const fetch = (sortByScore, hot = false) => {
    return new Promise((resolve, reject) => {
      const sort = sortByScore ? { score: -1 } : { createdAt: -1 }
      const limit = parentId ? conf.childrenLimit : conf.commentsLimit
      Comment.find({
        websiteId: website._id,
        parentId
      }, null, {
        limit: hot ? Math.floor(limit / 2) : limit,
        skip: hot ? Math.floor(offset / 2) : offset,
        sort
      }, (err, comments) => {
        if (err) return reject(err)

        if (comments.length === 0) {
          if (offset === 0) logErr(new Error('Website without comments.'))
          return resolve(comments)
        }

        let count = 0
        for (let i = 0; i < comments.length; i++) {
          comments[i].toObj(req.user && req.user._id).then(comment => {
            comments[i] = comment

            if (++count === comments.length) {
              return resolve(comments)
            }
          }).catch(err => reject(err))
        }
      })
    })
  }

  try {
    if (sort === 'score') {
      fetch(true).then(comments => res.json({ comments }))
    } else if (sort === 'new') {
      fetch(false).then(comments => res.json({ comments }))
    } else if (sort === 'hot' || parentId) {
      let allComments = []
      let gotFirst = false

      const callback = comments => {
        allComments = allComments.concat(comments)
        if (gotFirst) return res.json({ comments: allComments })
        else gotFirst = true
      }
      fetch(true).then(callback, true)
      fetch(false).then(callback, true)
    } else {
      throw new Error('Unknown error, no sort method or parent id.')
    }
  } catch (err) {
    logErr(err)
    res.status(500).end()
  }
})

router.post('/comments/:url/submit', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()
  const website = req.website

  const comment = new Comment({
    userId: req.user._id,
    websiteId: website.id,
    parentId: req.body.comment.parentId,
    text: req.body.comment.text,
  })
  comment.save().then(comment =>
    comment.toObj(req.user && req.user._id).then(commentObj => res.json(commentObj))).catch(err => {
    logErr(err)
    res.status(500).end()
  })
})

router.post('/comment/:id/like', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()

  Vote.like(req.user._id, req.params.id, (err, vote) => {
    if (err) res.status(500).end()
    else {
      let scoreChange
      if (vote) {
        // if this user already had voted on this comment
        if (vote.like) scoreChange = 0
        else scoreChange = 2
      } else scoreChange = 1
      Comment.findOneAndUpdate({ _id: req.params.id },
        { $inc: { score: scoreChange } }, (err, comment) => {
          if (err) {
            logErr(err)
            return res.status(500).end()
          }
          res.json({ scoreChange })
        })
    }
  })
})
router.post('/comment/:id/dislike', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()

  Vote.dislike(req.user._id, req.params.id, (err, vote) => {
    if (err) res.status(500).end()
    else {
      res.end()
    }
  })
})
router.post('/comment/:id/undovote', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()
  Vote.deleteOne({ userId: req.user._id, commentId: req.params.id }, err => {
    if (err) res.status(500).end()
    else res.end()
  })
})

router.get('/websites', (req, res) => {
  Website.find({}, null, { limit: 20, sort: { createdAt: -1 } }, (err, docs) => {
    for (let i = 0; i < docs.length; i++) {
      docs[i] = docs[i].toObject()
      docs[i].creationDate = docs[i].createdAt.toDateString()
    }
    if (err) return res.status(500).end()
    return res.json({ websites: docs })
  })
})

module.exports = router
