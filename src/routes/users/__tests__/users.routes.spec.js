const request = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { MongoClient } = require('mongodb')
const faker = require('faker')

const { app } = require('../../index')
const { getDb } = require('../../../db/index')

jest.setTimeout(10000)
jest.mock('../../../db/index')

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
  describe('search', () => {
    test('returns top 25 results', async () => {
      await users.insertMany(createUsers(50))
      await request(app)
        .get('/users/search')
        .expect(200)
        .then(response => expect(response.body).toHaveLength(25))
    })

    test.each([
      ['first names', { firstName: 'firstName' }, { firstName: 'firstNam' }],
      ['last names', { lastName: 'lastName' }, { lastName: 'lastNam' }],
      ['emails', { email: 'email-email' }, { email: 'email-emai' }]
    ])('returns %s starting with query', async (_description, user, query) => {
      const uniqueUser = User(user)
      await users.insertMany([{ ...uniqueUser }, ...createUsers(49)])
      await request(app)
        .get('/users/search')
        .query(query)
        .expect(200)
        .then(response => expect(response.body).toEqual([expect.objectContaining(uniqueUser)]))
    })
  })
  test('get a user by ID', async () => {
    const uniqueUser = User()
    await users.insertMany([uniqueUser, ...createUsers(50)])
    const { _id, ...rest } = uniqueUser
    await request(app)
      .get('/users/' + uniqueUser._id)
      .expect(200, { id: _id.toString(), ...rest })
  })
  test('create new user', async () => {
    const uniqueUser = User()
    await request(app)
      .post('/users')
      .send(uniqueUser)
      .expect(201)
    expect(await users.find({})
      .toArray())
      .toEqual([
        expect.objectContaining({ ...uniqueUser, _id: expect.anything() })
      ])
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
