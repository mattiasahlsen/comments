import log, { debug, logErr } from '../debug'
import conf from '../../config'
import WebsiteVote from '../models/websiteVote'
import { normalizeUrl, isValid } from '../../lib'

const Website = require('../models/website')
const Comment = require('../models/comment')

const express = require('express')
const router = express.Router()

