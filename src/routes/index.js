const bodyParser = require('body-parser')
const users = require('./users')
const express = require('express')
const { verify } = require('./auth')
const { StatusCodes } = require('http-status-codes')
const cors = require('cors')
const { createUser } = require('../db/users')

const app = express()

app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(authenticate)

app.use(function (req, res, next) {
  const { firstName, lastName, email } = res.locals.userData
  createUser({ firstName, lastName, email })
    .then(() => next())
    .catch(e => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message))
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', users)

app.get('*', function (req, res) {
  res.status(404)
})

module.exports = { app }

function authenticate (req, res, next) {
  verify(req.headers.authorization)
    .then(({ googleId, firstName, lastName, email }) => {
      res.locals.userData = { googleId, firstName, lastName, email }
      next()
    })
    .catch(e => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message))
}
