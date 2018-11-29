import logger, { debug, logErr } from '../debug'
const log = logger.log // logging function

const Website = require('../models/website')
const Comment = require('../models/comment')

const express = require('express')
const passport = require('passport')

const router = express.Router()

router.get('/comments/:url', (req, res) => {
  Website.find({ url: req.params.url }, (err, websites) => {
    if (err || websites.length !== 1) {
      // TODO: create new website or redirect to domain-wide?
      return res.status(404).end()
    }
    Comment.find({ websiteId: websites[0]._id }, (err, comments) => {
      if (err) {
        logErr(err)
        return res.status(500).end()
      }

      return res.json({
        comments
      })
    })
  })
})

module.exports = router
