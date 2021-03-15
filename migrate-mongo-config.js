require('dotenv').config()

const config = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: process.env.DB_NAME,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false
}

// Return the config as a promise
module.exports = config
