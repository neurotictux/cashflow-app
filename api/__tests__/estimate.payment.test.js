import request from 'supertest'
import app from '../src/app'

let token = null
let user = {
  'email': 'estimate@mail.com',
  'password': '123456'
}

beforeAll((done) => request(app).post('/api/token').send(user)
  .then(res => token = `Bearer ${res.body.token}`)
  .finally(() => done())
)

describe('Estimativas de Pagamentos', () => {
  test('Obter a estimativa furuta de pagamentos',
    done => request(app).get('/api/payment-estimative').set('Authorization', token)
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(2)
        expect(response.body[0].Installments.length).toBe(4)
        done()
      }))
})