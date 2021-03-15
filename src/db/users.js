const { pickBy, isNil, complement } = require('ramda')
const { getDb } = require('./index')

function getAllUsers ({ firstName, lastName, email } = {}) {
  const filter = createStartsWithFilter({ firstName, lastName, email })
  pickBy(complement(isNil), { firstName, lastName, email })
  return getDb()
    .collection('users')
    .find(filter)
    .limit(25)
    .toArray()
}

function getUser (id) {
  const { firstName, lastName, _id } = getDb()
    .collection('users')
    .findOne({ _id: id })
  return { firstName, lastName, id: _id }
}

module.exports = { getAllUsers, getUser }

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
