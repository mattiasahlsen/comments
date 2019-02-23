import axios from 'axios'
import log, { debug, logErr } from '../debug'
import conf from '../../config'

const { google } = require('googleapis')
const express = require('express')

if (!process.env.YOUTUBE_API_KEY) throw new Error('YOUTUBE_API_KEY not defined in env.')
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})
const router = express.Router()

/*
let image
let counter = 0
let callback
callback = (err, resp) => {
  counter++
  let gotErr = false
  let got403 = false
  resp.data.items.forEach(video => {
    youtube.commentThreads.list({
      part: 'id',
      videoId: video.id
    }, (err, resp) => {
      if (resp && resp.status === 403) {
        got403 = true
        console.log('403!')
      } else if (resp && resp.status !== 200) {
        console.log(resp.status)
      }
      if (err) {
        console.log('Got error!')
        console.log(err)
        gotErr = true
      }
    })
  })
  if (counter === 30) {
    console.log('Reached counter max.')
    return
  }
  if (got403 || gotErr) return
  console.log('Getting more videos.')
  youtube.videos.list({
    part: 'player,id,snippet',
    chart: 'mostPopular',
    maxResults: 50,
    pageToken: resp.data.nextPageToken
  }, callback)
}

// youtube.videos.list({
//   part: 'player,id,snippet',
//   chart: 'mostPopular',
//   maxResults: 50
// }, callback)

// const myCallback = (err, resp) => {
//   const video = resp.data.items[0]
//   console.log(video.snippet.thumbnails)
//   axios.get(video.snippet.thumbnails.default.url,
//     { responseType: 'arraybuffer' }).then(resp => {
//     console.log('Got image')
//     image = Buffer.from(resp.data, 'binary').toString('base64')
//     console.log(image)
//   }).catch(err => console.log(err))
// }

router.get('/thumbnail', (req, res, next) => {
  return res.send(image)
})
*/

module.exports = router
