// Write your tests here

const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')

test('true is true', () => {
  expect(true).toBe(true)
});

test('is testing environment', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('[POST] to /api/auth/register', () => {
  const reqBody = { username: 'defalco', password: '1234' }
  test('responds with status 201', async () => {
    const res = await request(server).post('/api/auth/register').send(reqBody)
    expect(res.status).toBe(201)
  })

  test('returns proper body', async () => {
    const res = await request(server).post('/api/auth/register').send(reqBody)
    expect(res.body).toMatchObject({ username: 'defalco' })
  })

  test('fails if user already exists', async () => {
    await request(server).post('/api/auth/register').send(reqBody)
    const res = await request(server).post('/api/auth/register').send(reqBody)
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('username taken')
  })

  test('username and password required', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: '', password: '' })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('username and password required')
  })
  
})
