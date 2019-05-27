import jwt from 'jsonwebtoken'
import sha1 from 'sha1'
import { UserService } from 'cashflow-cross-cutting'

import { SECRET } from '../config'
import { errorHandler, throwValidationError } from '../util'
import { UserRepository } from '../repository'

const service = new UserService(UserRepository)

export default (app) => {
  app.get('/api/user', errorHandler(async (req, res) => {
    return service.getUserData(req.claims.id)
      .then(user => res.json({
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastAccess: user.lastAccess
      }))
  }))

  app.post('/api/token', errorHandler(async (req, res) => {
    const { email, password } = req.body || {}
    if (!email || !password)
      throwValidationError('Email/senha inválido.')
    const user = await service.getByEmail(email)
    if (!user || user.password !== sha1(password))
      throwValidationError('Email/senha inválido.')
    return res.json({
      token: jwt.sign({ id: user.id }, SECRET),
      message: 'Token gerado com sucesso.'
    })
  }))

  app.post('/api/user', errorHandler(async (req, res) => {
    const user = req.body || {}
    user.id = null
    const userDb = await service.create(user)
    res.json({
      token: jwt.sign({ id: userDb.id }, SECRET),
      message: 'Usuário criado com sucesso.'
    })
  }))

  app.put('/api/user', errorHandler(async (req, res) => {
    const user = req.body || {}
    user.id = req.claims.id
    return service.update(user).then(() => res.json({ message: 'Usuário alterado com sucesso.' }))
  }))

  app.put('/api/user-password', errorHandler(async (req, res) => {
    const user = req.body || {}
    user.id = req.claims.id
    return service.updatePassword(user)
      .then(() => res.json({ message: 'Senha alterada com sucesso.' }))
  }))
}