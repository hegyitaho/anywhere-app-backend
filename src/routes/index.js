const users = require('./users')
const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', users)

module.exports = { app }
