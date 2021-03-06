import { logErr } from './debug'

const merge = require('webpack-merge')
const path = require('path')
const env = require('dotenv')

// simluate https://cli.vuejs.org/guide/mode-and-env.html#modes
// without vue-cli-service
// priority should be highest first, i.e. env.local is lowest priority
if (process.env.NODE_ENV === 'development') {
  env.config({ path: path.join(__dirname, '../../.env.development.local') })
  env.config({ path: path.join(__dirname, '../../.env.development') })
} else if (process.env.NODE_ENV === 'test') {
  env.config({ path: path.join(__dirname, '../../.env.test.local') })
  env.config({ path: path.join(__dirname, '../../.env.test') })
} else if (process.env.NODE_ENV === 'production') {
  env.config({ path: path.join(__dirname, '../../.env.production.local') })
  env.config({ path: path.join(__dirname, '../../.env.production') })
}
env.config({ path: path.join(__dirname, '../../.env.local') })
env.config({ path: path.join(__dirname, '../../.env') })

if (!process.env.SECRET) {
  const err = new Error('You need to defined env variable SECRET.')
  logErr(err)
  throw err
}
const baseConf = {
  secret: process.env.SECRET,
  host: process.env.VUE_APP_API_HOST,
  port: normalizePort(process.env.VUE_APP_API_PORT || '3000'),

  serverPort: process.env.SERVER_PORT || 443,

  sessionMaxAge: 1000 * 3600 * 24, // 24 hours for now

  dbOptions: {
    useNewUrlParser: true
  }
}

export const devConf = merge(baseConf, {
  dbOptions: {
    autoIndex: true,
  }
})

const DB_USER = process.env.DB_CREDS_USR || process.env.DB_USER
const DB_PASS = process.env.DB_CREDS_PSW || process.env.DB_PASS

const userAndPass = DB_USER && DB_PASS
  ? `${process.env.DB_USER}:${process.env.DB_PASS}@` : ''

export const prodConf = merge(baseConf, {
  db: {
    uri: `mongodb://${userAndPass}${process.env.DB_HOST || '127.0.0.1'}:27017/comments?authSource=admin`,
    sessionCollection: 'sessions'
  }
})

const conf = process.env.NODE_ENV === 'production' ? prodConf : devConf
export default conf

/**
 * Normalize a port into a number.
 */
function normalizePort(val) {
  var port = parseInt(val, 10)
  if (isNaN(port) || port < 0) {
    throw new Error('Invalid port.')
  }
  return port
}
