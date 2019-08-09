import axios from 'axios'
import log, { debug, logErr } from '../debug'
import conf from '../../config'
import Vote from '../models/vote'
import { normalizeUrl, isValid } from '../../lib'

const Website = require('../models/website')
const News = require('../models/news')

const express = require('express')
const router = express.Router()

const NEWS_API_KEY = process.env.VUE_APP_NEWS_API_KEY
if (!NEWS_API_KEY) throw new Error('NEWS_API_KEY not defined in env.')

const getSources = axios.get('https://newsapi.org/v2/sources?apiKey=' + NEWS_API_KEY).then(resp => {
  return resp.data.sources
}).catch(err => {
  logErr(err)
  throw err
})
const getNewHeadlines = () => axios.get('https://newsapi.org/v2/top-headlines?language=en&apiKey=' + NEWS_API_KEY).then(resp => {
  resp.data.articles.forEach(article => new News(article).save().then(article => {
    const url = normalizeUrl(article.url)
    return Website.findOneAndUpdate({ url }, { newsId: article._id }, { new: true, upsert: true })
  }).catch(err => logErr(err)))
  return resp.data.articles
}).catch(err => {
  logErr(err)
  throw err
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
