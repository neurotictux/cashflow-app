import { Payment } from '../sequelize/models'

const payments = [{}, {}]

export default (app) => {
  app.get('/api/payment', (req, res) => {
    Payment.findAll({ where: { userId: req.claims.id } })
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })
  app.get('/api/payment/:id', (req, res) => {
    res.json(payments)
    // db.Payment
    //   .findAll(result => res.json(result))
    //   .catch(err => res.json(err))
  })
}