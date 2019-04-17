import jwt from 'jsonwebtoken'

import { User } from '../sequelize/models'
import { SECRET } from '../config'

export default (app) => {
  app.post('/api/token', (req, res) => {
    const { email, password } = req.body || {}
    if (!email || !password)
      return res.status(401).json({ message: 'Email/senha inválido.' })
    User.findOne({ where: { email: email } }).then(user => {
      if (user && user.password === password)
        res.json({ token: jwt.sign({ id: user.id }, SECRET) })
      else
        res.status(401).json({ message: 'Email/senha inválido.' })
    }).catch(() => res.status(500).json({ message: 'Ocorreu um erro no servidor' }))
  })

  app.get('/api/user', (req, res) => {
    User.findOne({ where: { id: req.claims.id } })
      .then(user => res.json(user ? { name: user.name, email: user.email } : null))
      .catch(() => res.status(500).json({ message: 'Ocorreu um erro no servidor' }))
  })
}