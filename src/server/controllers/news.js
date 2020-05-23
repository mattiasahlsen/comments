import axios from 'axios'
import log, { debug, logErr } from '../debug'
import conf from '../../config'
import Vote from '../models/vote'
import Comment from '../models/comment'
import { normalizeUrl, isValid } from '../../lib'

const Website = require('../models/website')
const Account = require('../models/account')
const News = require('../models/news')

const express = require('express')
const router = express.Router()

const NEWS_API_KEY = process.env.VUE_APP_NEWS_API_KEY
if (!NEWS_API_KEY) throw new Error('NEWS_API_KEY not defined in env.')

const simulatedUsers = []
for (let i = 0; i < 20; i++) {
  simulatedUsers.push('simulated.user' + i + '@gmail.com')
}

const getSources = axios.get('https://newsapi.org/v2/sources?apiKey=' + NEWS_API_KEY).then(resp => {
  return resp.data.sources
}).catch(err => {
  logErr(err)
  throw err
})
const getNewHeadlines = () => axios.get('https://newsapi.org/v2/top-headlines?language=en&apiKey=' + NEWS_API_KEY).then(resp => {
  log('Getting new headlines...')
  resp.data.articles.forEach(article => new News(article).save().then(article => {
    const url = normalizeUrl(article.url)
    return Website.findOneAndUpdate({ url }, { newsId: article._id }, { new: true, upsert: true })
  })
  .then(async website => {
    try {
      const users = []
      for (let simulatedUser of simulatedUsers) {
        users.push(await Account.findOne({ username: simulatedUser }).exec())
      }
      const comments = []
      const responses = []
      for (let user of users) {
        const comment = new Comment({
          userId: user._id,
          websiteId: website.id,
          text: 'Simulated comment'
        })
        comments.push(await comment.save())
      }
      let i = 0
      for (let user of users) {
        const comment = new Comment({
          userId: user._id,
          websiteId: website.id,
          text: 'Simulated response ' + i,
          parentId: comments[0]._id
        })
        responses.push(await comment.save())
        new Vote({
          objectId: comments[0]._id,
          userId: user._id,
          like: true,
        }).save()

        i++
      }
    } catch (err) {
      logErr(err)
    }
  })
  .catch(err => logErr(err)))
  return resp.data.articles
}).catch(err => {
  logErr(err)
})
let getHeadlines = getNewHeadlines()
setInterval(() => {
  getHeadlines = getNewHeadlines() // get new headlines every 24 hours
}, 24 * 3600 * 1000)

router.get('/sources', (req, res, next) => {
  getSources.then(sources => res.json(sources))
    .catch(err => {
      logErr(err)
      res.status(500).end()
    })
})
router.get('/headlines', (req, res, next) => {
  getHeadlines.then(headlines => res.json(headlines))
    .catch(err => {
      logErr(err)
      res.status(500).end()
    })
})

module.exports = router
