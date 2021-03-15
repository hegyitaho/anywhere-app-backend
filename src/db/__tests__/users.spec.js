const { MongoMemoryServer } = require('mongodb-memory-server')
const { MongoClient } = require('mongodb')
const faker = require('faker')

const { getAllUsers } = require('../users')
const { getDb } = require('../index')

jest.setTimeout(10000)
jest.mock('../index', () => ({
  getDb: jest.fn()
}))

describe('users endpoints', () => {
  let server
  let client
  /** @type import('mongodb').Collection */
  let users

  beforeAll(async () => {
    server = new MongoMemoryServer()
    const mongoUri = await server.getUri()
    client = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    const db = client.db(await server.getDbName())
    getDb.mockReturnValue(db)
    users = db.collection('users')
  })

  afterAll(async () => {
    await client.close()
    await server.stop()
  })

  afterEach(async () => {
    await users.deleteMany({})
  })

  test('returns top 25 results', async () => {
    users.insertMany(createUsers(50))
    expect(await getAllUsers()).toHaveLength(25)
  })

  test.each([
    ['first names', { firstName: 'firstName' }, { firstName: 'firstNam' }],
    ['last names', { lastName: 'lastName' }, { lastName: 'lastNam' }],
    ['first names', { email: 'email-email' }, { email: 'email-emai' }]
  ])('returns %s starting with query', async (_description, user, query) => {
    const uniqueUser = User(user)
    users.insertMany([uniqueUser, ...createUsers(49)])
    expect(await getAllUsers(query)).toEqual([uniqueUser])
  })
})

function createUsers (number) {
  return new Array(number).fill({}).map(User)
}

function User ({
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  email = faker.internet.email()
} = {}) {
  return { firstName, lastName, email }
}
