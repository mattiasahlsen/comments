import config from '../config'
import { debug, debugErr } from '../debug'
import app from '../app'

const http = require('http')

app.set('port', config.port)
const server = http.createServer(app)

server.listen(config.port)
if (process.env.NODE_ENV === 'production') console.log('Started server at port ' + config.port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  debugErr(error)
  if (error.syscall !== 'listen') {
    throw error
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES': throw new Error(config.port + ' requires elevated privileges')
    case 'EADDRINUSE': throw new Error(config.port + ' is already in use')
    default: throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('HTTP server listening on ' + bind)
}
