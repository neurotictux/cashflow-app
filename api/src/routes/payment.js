// import { db } from '../repository/db'

const payments = [{}, {}]

export default (app) => {
  app.get('/payment', (req, res) => {
    res.json(payments)
    // db.Payment
    //   .findAll(result => res.json(result))
    //   .catch(err => res.json(err))
  })
  app.get('/payment/:id', (req, res) => {
    res.json(payments)
    // db.Payment
    //   .findAll(result => res.json(result))
    //   .catch(err => res.json(err))
  })
}