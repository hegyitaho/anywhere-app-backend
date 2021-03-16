const express = require('express')
const Joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const { getAllUsers, getUser } = require('../../db/users')
const router = express.Router()

router.get('/search', async (req, res) => {
  const { error } = userQuerySchema.validate(req.query)
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).send(error.message)
  }
  try {
    res.send(await getAllUsers(req.query))
  } catch (e) {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
  }
})

router.get('/:id', async (req, res) => {
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).send('"id" is required')
  }
  try {
    const user = await getUser(req.params.id)
    if (!user.id) {
      return res.sendStatus(StatusCodes.NOT_FOUND)
    }
    res.send(user)
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message)
  }
})

router.post('/', async (req, res) => {
  const { error } = newUserSchema.validate(req.query)
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).send(error.message)
  }
  try {
    await newUserSchema.validateAsync()
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).send(e.message)
  }

  res.sendStatus(StatusCodes.CREATED)
})

module.exports = router

const newUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required()
}).required()

const userQuerySchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string()
})
