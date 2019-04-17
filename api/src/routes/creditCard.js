import { CreditCard } from '../sequelize/models'

export default (app) => {
  app.get('/credit-card', (req, res) => {
    CreditCard.findAll()
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })
  app.get('/credit-card/:userId', (req, res) => {
    const { userId } = req.params
    CreditCard.findAll({ where: { userId: userId } })
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })
}