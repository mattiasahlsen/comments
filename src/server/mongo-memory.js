import MongoMemoryServer from 'mongodb-memory-server'
import { debug } from './debug'

async function createDb () {
  const mongod = new MongoMemoryServer({
    instance: {
      ip: '127.0.0.1',
      dbName: 'comments-mongo-memory-server',
      port: 27018 // standard mongo port + 1
    }
  })
  const uri = await mongod.getConnectionString()
  const port = await mongod.getPort()
  const dbPath = await mongod.getDbPath()
  const dbName = await mongod.getDbName()

  debug('Mongo memory server uri: ' + uri)

  return {
    mongod,
    config: {
      uri,
      port,
      dbPath,
      dbName
    }
  }
}

export default createDb
