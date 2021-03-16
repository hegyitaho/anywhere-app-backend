const { ObjectId } = require('mongodb').ObjectId
const { pickBy, isNil, complement, map } = require('ramda')
const { getDb } = require('./index')

function getAllUsers ({ firstName, lastName, email } = {}) {
  const filter = createStartsWithFilter({ firstName, lastName, email })
  pickBy(complement(isNil), { firstName, lastName, email })
  return getDb()
    .collection('users')
    .find(filter)
    .limit(25)
    .toArray()
    .then(map(({ firstName, lastName, email, _id }) => ({ firstName, lastName, email, id: _id.toString() })))
}

async function getUser (id) {
  const { firstName, lastName, email, _id } = (await getDb()
    .collection('users')
    .findOne({ _id: ObjectId(id) })) || {}
  return { firstName, lastName, email, id: _id }
}

function createUser ({ firstName, lastName, email }) {
  return getDb()
    .collection('users')
    .insertOne({ firstName, lastName, email })
}

module.exports = { getAllUsers, getUser, createUser }

function createStartsWithFilter ({ firstName, lastName, email }) {
  return Object.fromEntries(
    Object.entries({ firstName, lastName, email })
      .filter(([_key, val]) => !!val)
      .map(([key, val]) => ([key, startsWith(val)]))
  )
}

function startsWith (searchTerm) {
  return new RegExp('^' + searchTerm, 'i')
}
