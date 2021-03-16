const bodyParser = require('body-parser')
const users = require('./users')
const express = require('express')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', users)

app.get('*', function (req, res) {
  res.status(404)
})

module.exports = { app }
