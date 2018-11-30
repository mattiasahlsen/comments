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

const baseConf = {
  secret: process.env.SECRET,
  host: process.env.VUE_APP_API_HOST,
  port: normalizePort(process.env.VUE_APP_API_PORT || '3000'),
  serverUrl: process.env.SERVER_URL,

  sessionMaxAge: 1000 * 3600 * 24, // 24 hours for now

  dbOptions: {
    useNewUrlParser: true
  }
}

export const devConf = merge(baseConf, {
  dbOptions: {
    autoIndex: false,
  }
})

export const prodConf = merge(baseConf, {

})

const conf = process.env.NODE_ENV === 'production' ? prodConf : devConf
export default conf

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}
