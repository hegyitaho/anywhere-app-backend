const MongoClient = require('mongodb').MongoClient

/** @type import 'mongodb'.Db */
let db
let client

MongoClient.connect(process.env.MONGO_URI, function (err, mongoClient) {
  if (err) {
    throw err
  }
  console.log('Connected successfully to server')
  client = mongoClient
  db = client.db(process.env.DB_NAME)
})

function getDb () {
  return db
}

module.exports = { getDb }

process.on('SIGINT', () => {
  client.close()
  process.exit()
})

process.on('SIGTERM', () => {
  client.close()
  process.exit()
})
