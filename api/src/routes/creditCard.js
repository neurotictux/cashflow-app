import { CreditCard } from '../sequelize/models'
import { createCreditCardService } from '../services'
import errorHandler from '../util/errorHandler'

const repository = {
  getAll: (userId) => CreditCard.findAll({ where: { userId: userId } }),
  create: (card) => CreditCard.create(card),
  update: (card, userId) => CreditCard.update({ name: card.name }, { where: { id: card.id, userId: userId } }),
  remove: (id, userId) => CreditCard.destroy({ where: { id: id, userId: userId } })
}

const service = createCreditCardService(repository)

export default (app) => {
  app.get('/api/credit-card', errorHandler((req, res) => service.getAll(req.claims.id).then(result => res.json(result))))

  app.post('/api/credit-card', errorHandler((req, res) => service.create(req.body, req.claims.id).then(result => res.json(result))))

  app.put('/api/credit-card', errorHandler((req, res) => service.update(req.body, req.claims.id).then(result => res.json(result))))

  app.delete('/api/credit-card/:id', errorHandler((req, res) => service.remove(req.params.id, req.claims.id).then(result => res.json(result))))
}