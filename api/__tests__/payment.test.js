import request from 'supertest'
import app from '../src/app'

beforeAll((done) => setTimeout(() => done(), 0))

describe('Payments', () => {
  test('Get payments list', (done) => {
    request(app).get('/api/payment').then((response) => {
      expect(response.statusCode).toBe(200)
      expect(response.body.length).toBeGreaterThan(0)
      done()
    })
  })
})