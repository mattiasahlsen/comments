import axios from 'axios'
import log, { debug, logErr } from '../debug'
import conf from '../../config'

const express = require('express')

if (!process.env.NEWS_API_KEY) throw new Error('NEWS_API_KEY not defined in env.')
const router = express.Router()



module.exports = router