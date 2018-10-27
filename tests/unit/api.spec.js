/**
 * @jest-environment ./tests/unit/mongo-env
 */
// Relative to root

import supertest from 'supertest-session'

import config from '@/server/config'
let app
let request

beforeAll(async () => {
  config.db = global.db.config // this must come before app is imported
  app = (await import('@/server/app')).default
  request = supertest(app)
})

test('auth', async () => {
  expect.assertions(2)
  const isAuthed = responseCode => {
    return request
      .get('/api/authed')
      .expect(responseCode)
  }
  const register = responseCode => {
    return request
      .post('/api/register')
      .send({
        username: 'test@gmail.com',
        password: 'test'
      })
      .expect(responseCode)
  }
  const login = responseCode => {
    return request
      .post('/api/login')
      .send({ username: 'test@gmail.com', password: 'test' })
      .expect(responseCode)
  }
  const loginWrongUsername = responseCode => {
    return request
      .post('/api/login')
      .send({ username: 'test1@gmail.com', password: 'test' })
      .expect(responseCode)
  }
  const loginWrongPassword = responseCode => {
    return request
      .post('/api/login')
      .send({ username: 'test@gmail.com', password: 'test2' })
      .expect(responseCode)
  }
  const logout = responseCode => {
    return request
      .post('/api/logout')
      .expect(responseCode)
  }

  await isAuthed(401)
  await register(200)
  await register(500)
  await isAuthed(200)
  await logout(200)
  await isAuthed(401)
  await loginWrongUsername(401)
  await loginWrongPassword(401)
  await isAuthed(401)
  await login(200)
  await isAuthed(200)

  expect(
    (await request.get('/api/ping').expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')).text)
    .toBe('pong!')
  await request.get('/boguspath').expect(404)

  expect(true).toBe(true) // done, if no error was thrown we made it
})
