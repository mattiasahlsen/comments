const merge = require('webpack-merge')

const baseConf = {

}

export const devConf = merge(baseConf, {
  // obviously this shouldn't be stored in cleartext in production
  secret: '7a4588feca44f607f370551d666c603f9224ca0d0cedf7b9e1914af9451aa85f',
  host: 'localhost', // url of this server,
  port: normalizePort(process.env.PORT || '3000')
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
