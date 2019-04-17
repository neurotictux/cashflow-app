import { CreditCard } from '../sequelize/models'

export default (app) => {
  app.get('/api/credit-card', (req, res) => {
    CreditCard.findAll({ where: { userId: req.claims.id } })
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })
}