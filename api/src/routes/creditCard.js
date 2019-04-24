import { CreditCard } from '../sequelize/models'
import { createCreditCardService } from '../services'

const repository = {
  getAll: (userId) => CreditCard.findAll({ where: { userId: userId } }),
  create: (card) => CreditCard.create(card),
  update: (card, userId) => CreditCard.update({ name: card.name }, { where: { id: card.id, userId: userId } }),
  remove: (id, userId) => CreditCard.destroy({ where: { id: id, userId: userId } })
}

const service = createCreditCardService(repository)

export default (app) => {

  app.get('/api/credit-card', (req, res) => {
    service.getAll(req.claims.id)
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })

  app.post('/api/credit-card', (req, res) => {
    service.create(req.body, req.claims.id)
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })

  app.put('/api/credit-card', (req, res) => {
    service.update(req.body, req.claims.id)
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })

  app.delete('/api/credit-card/:id', (req, res) => {
    service.remove(req.params.id, req.claims.id)
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })
}