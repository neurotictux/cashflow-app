import request from 'supertest'
import app from '../src/app'

let token = null
let user = {
  'email': 'user_mock_1@mail.com',
  'password': '123456'
}

beforeAll((done) => request(app).post('/api/token').send(user)
  .then(res => token = `Bearer ${res.body.token}`)
  .finally(() => done())
)

describe('Pagamentos', () => {
  test('Obter lista de pagamentos',
    done => request(app).get('/api/payment').set('Authorization', token)
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(2)
        expect(response.body[0].installments.length).toBe(4)
        done()
      }))

  test('Criar pagamento sem descrição',
    done => request(app).post('/api/payment')
      .set('Authorization', token)
      .send({ description: '' })
      .then(response => {
        expect(response.body.message).toBe('A descrição é obrigatória.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Criar pagamento com tipo inválido',
    done => request(app).post('/api/payment')
      .set('Authorization', token)
      .send({ description: 'pagamento', firstPaymentDate: new Date(), type: 0 })
      .then(response => {
        expect(response.body.message).toBe('O tipo do pagamento deve ser \'1\' para RENDA ou \'2\' para DESPESA.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Criar pagamento sem parcelas',
    done => request(app).post('/api/payment')
      .set('Authorization', token)
      .send({ description: 'pagamento', firstPaymentDate: new Date(), type: 1, installments: [] })
      .then(response => {
        expect(response.body.message).toBe('O pagamento deve ter pelo menos 1 parcela.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Criar pagamento com pagamento fixo e erro por ter mais de uma parcela',
    done => request(app).post('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        fixedPayment: true,
        installments: [{}, {}]
      })
      .then(response => {
        expect(response.body.message).toBe('Pagamento fixo não pode ter mais de 1 parcela.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Criar pagamento com parcelas de número repetido',
    done => request(app).post('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 2, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Há mais de uma parcela com o mesmo número de prestação.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Criar pagamento com parcelas sem número',
    done => request(app).post('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 0, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Há parcelas sem número.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Criar pagamento com parcelas com data inválida',
    done => request(app).post('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 3, cost: 65, date: new Date('') }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Há parcelas com data inválida.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Criar pagamento com cartão inexistente',
    done => request(app).post('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        creditCard: { id: 99 },
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 3, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Cartão não localizado.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Criar pagamento com cartão de outro usuário',
    done => request(app).post('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        creditCard: { id: 3 },
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 3, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Cartão não localizado.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Criar pagamento OK',
    done => request(app).post('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 3, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Pagamento inserido com sucesso.')
        expect(response.statusCode).toBe(200)
        done()
      }))

  test('Atualizar pagamento que não pertence ao usuário',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({
        id: 3,
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 3, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Pagamento não localizado.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Atualizar pagamento que não existe',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({
        id: 99,
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 3, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Pagamento não localizado.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Atualizar pagamento sem descrição',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({ description: '' })
      .then(response => {
        expect(response.body.message).toBe('A descrição é obrigatória.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Atualizar pagamento com tipo inválido',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({ description: 'pagamento', firstPaymentDate: new Date(), type: 0 })
      .then(response => {
        expect(response.body.message).toBe('O tipo do pagamento deve ser \'1\' para RENDA ou \'2\' para DESPESA.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Atualizar pagamento sem parcelas',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({ description: 'pagamento', firstPaymentDate: new Date(), type: 1, installments: [] })
      .then(response => {
        expect(response.body.message).toBe('O pagamento deve ter pelo menos 1 parcela.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Atualizar pagamento com pagamento fixo e erro por ter mais de uma parcela',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        fixedPayment: true,
        installments: [{}, {}]
      })
      .then(response => {
        expect(response.body.message).toBe('Pagamento fixo não pode ter mais de 1 parcela.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Atualizar pagamento com parcelas de número repetido',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 2, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Há mais de uma parcela com o mesmo número de prestação.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Atualizar pagamento com parcelas sem número',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 0, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Há parcelas sem número.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Atualizar pagamento com parcelas com data inválida',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 3, cost: 65, date: new Date('') }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Há parcelas com data inválida.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Atualizar pagamento com cartão inexistente',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        creditCard: { id: 99 },
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 3, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Cartão não localizado.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Atualizar pagamento com cartão de outro usuário',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        creditCard: { id: 3 },
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 3, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Cartão não localizado.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Atualizar pagamento OK',
    done => request(app).put('/api/payment')
      .set('Authorization', token)
      .send({
        id: 1,
        description: 'pagamento',
        firstPaymentDate: new Date(),
        type: 1,
        installments: [
          { number: 1, cost: 12, date: new Date() },
          { number: 2, cost: 45, date: new Date() },
          { number: 3, cost: 65, date: new Date() }
        ]
      })
      .then(response => {
        expect(response.body.message).toBe('Pagamento atualizado com sucesso.')
        expect(response.statusCode).toBe(200)
        done()
      }))

  test('Remover pagamento que não pertence ao usuário',
    done => request(app).delete('/api/payment/3')
      .set('Authorization', token)
      .then(response => {
        expect(response.body.message).toBe('Pagamento não localizado.')
        expect(response.statusCode).toBe(400)
        done()
      }))

  test('Remover pagamento OK',
    done => request(app).delete('/api/payment/2')
      .set('Authorization', token)
      .then(response => {
        expect(response.body.message).toBe('Pagamento removido com sucesso.')
        expect(response.statusCode).toBe(200)
        done()
      }))
})