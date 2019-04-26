import { createPaymentService } from '../services'
import errorHandler from '../util/errorHandler'
import { PaymentRepository } from '../repository'

const service = createPaymentService(PaymentRepository)

export default (app) => {
  app.get('/api/payment', errorHandler((req, res) => service.getByUser(req.claims.id).then(result => res.json(result))))
  app.post('/api/payment', errorHandler(async (req, res) => {
    const payment = req.body || {}
    payment.userId = req.claims.id
    return service.create(payment).then(result => res.json(result))
  }))
}