import request from 'supertest'
import app from '../src/app'

let token = null
let user = {
  'email': 'user_mock_2@mail.com',
  'password': '123456'
}

beforeAll((done) => {
  request(app).post('/api/token').send(user)
    .then(res => {
      token = `Bearer ${res.body.token}`
    })
    .catch(err => { throw err })
    .finally(() => done())
})

describe('User', () => {
  test('Obter os dados do usuário', (done) => {
    request(app).get('/api/user').set('Authorization', token)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body.email).toBe('user_mock_2@mail.com')
        done()
      })
  })
})