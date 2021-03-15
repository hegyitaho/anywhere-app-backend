const MongoClient = require('mongodb').MongoClient

let db
let client

MongoClient.connect(process.env.MONGO_URI, function (err, client) {
  if (err) {
    throw err
  }
  console.log('Connected successfully to server')

  db = client.db(process.env.DB_NAME)
})

module.exports = { db }

process.on('SIGINT', () => {
  client.close()
  process.exit()
})

process.on('SIGTERM', () => {
  client.close()
  process.exit()
})
