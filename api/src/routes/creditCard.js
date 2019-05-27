import { CreditCardService } from 'cashflow-cross-cutting'

import { errorHandler } from '../util'
import { CreditCardRepository } from '../repository'

const service = new CreditCardService(CreditCardRepository)

export default (app) => {
  app.get('/api/credit-card', errorHandler((req, res) => service.getByUser(req.claims.id).then(result => res.json(result))))

  app.post('/api/credit-card', errorHandler(async (req, res) => {
    const card = req.body || {}
    card.userId = req.claims.id
    return service.create(card).then(result => res.json(result))
  }))

  app.put('/api/credit-card', errorHandler(async (req, res) => {
    const card = req.body || {}
    card.userId = req.claims.id
    return service.update(card).then(result => res.json(result))
  }))

  app.delete('/api/credit-card/:id', errorHandler((req, res) => service.remove({ id: req.params.id, userId: req.claims.id }).then(result => res.json(result))))
}