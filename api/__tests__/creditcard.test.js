import request from 'supertest'
import app from '../src/app'

let token = null
let user = {
  'email': 'user_mock_2@mail.com',
  'password': '123456'
}

beforeAll((done) =>
  request(app).post('/api/token').send(user)
    .then(res => token = `Bearer ${res.body.token}`)
    .catch(err => { throw err })
    .finally(() => done()))

describe('Credit Cards', () => {

  test('Obter cartões do usuário', (done) =>
    request(app).get('/api/credit-card').set('Authorization', token)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(2)
        done()
      }))

  test('Criar cartão', (done) =>
    request(app).post('/api/credit-card')
      .send({ name: 'Primeiro cartão teste mock' })
      .set('Authorization', token)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        done()
      }))

  test('Atualizar cartão', (done) =>
    request(app).put('/api/credit-card')
      .send({ id: 3, name: 'Cartão atualizado pelo mock' })
      .set('Authorization', token)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        done()
      }))

  test('Remove cartão', (done) =>
    request(app).delete('/api/credit-card/4')
      .set('Authorization', token)
      .then((response) => {
        expect(response.statusCode).toBe(200)
        done()
      }))
})