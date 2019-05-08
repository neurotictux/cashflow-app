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
  test('Sem enviar parâmetros',
    done => request(app).get('/api/payment-estimative').set('Authorization', token)
      .then(response => {
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('Informe os parametros \'startDate\' e \'endDate\' no formato \'MM/yyyy\'.')
        done()
      }))

  test('Obter a estimativa enviando parâmetros inconsistentes',
    done => request(app).get('/api/payment-estimative?startDate=06/2020&endDate=12/2019').set('Authorization', token)
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(Object.keys(response.body).length).toBe(0)
        done()
      }))

  test('Obter a estimativa enviando parâmetros corretos',
    done => request(app).get('/api/payment-estimative?startDate=01/2019&endDate=12/2020').set('Authorization', token)
      .then(response => {
        expect(response.statusCode).toBe(200)
        let sum = 24 * 2000 // Salário - 30.000
        sum -= 24 * 88 // Internet - 1.144
        sum -= 10 * 100 // Computador - 1.000
        sum -= 4 * 100 // Televisão - 400
        sum -= 4 * 100 // Balcão - 400

        const result = response.body['12/2020']
        expect(result.accumulatedCost).toBe(sum)
        done()
      }))
})