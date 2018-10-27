import MongoMemoryServer from 'mongodb-memory-server'

async function createDb () {
  const mongod = new MongoMemoryServer()
  const uri = await mongod.getConnectionString()
  const port = await mongod.getPort()
  const dbPath = await mongod.getDbPath()
  const dbName = await mongod.getDbName()

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
