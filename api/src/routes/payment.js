import { createPaymentService } from '../services'
import errorHandler from '../util/errorHandler'
import { PaymentRepository, CreditCardRepository } from '../repository'

const service = createPaymentService(PaymentRepository, CreditCardRepository)

export default (app) => {
  app.get('/api/payment', errorHandler((req, res) => service.getByUser(req.claims.id).then(result => res.json(result))))
  app.get('/api/payment-estimative', errorHandler((req, res) => service.getEstimative(req.claims.id).then(result => res.json(result))))
  app.post('/api/payment', errorHandler(async (req, res) => {
    const payment = req.body || {}
    payment.userId = req.claims.id
    return service.create(payment)
      .then(result => res.json({ payment: result, message: 'Pagamento inserido com sucesso.' }))
  }))
  app.put('/api/payment', errorHandler(async (req, res) => {
    const payment = req.body || {}
    payment.userId = req.claims.id
    payment.id = payment.id || 0
    return service.update(payment)
      .then(result => res.json({ payment: result, message: 'Pagamento atualizado com sucesso.' }))
  }))
  app.delete('/api/payment/:id', errorHandler(async (req, res) => {
    const payment = { id: req.params.id, userId: req.claims.id }
    return service.remove(payment)
      .then(() => res.json({
        message: 'Pagamento removido com sucesso.'
      }))
  }))
}