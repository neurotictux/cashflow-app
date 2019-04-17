import jwt from 'jsonwebtoken'
import { SECRET } from '../config'

const isFree = (req) => {
  const { path, method } = req
  const freeRoutes = [
    { path: '/api/user', method: 'POST' },
    { path: '/api/token', method: 'POST' }
  ]
  return !path.startsWith('/api/') || !!freeRoutes.find(p => p.path === path && p.method === method)
}

export default (req, res, next) => {
  if (isFree(req))
    return next()
  const arr = (req.headers.authorization || '').split(' ')
  if (arr[0].toLowerCase() !== 'bearer' || !arr[1])
    return res.status(401).json({ message: 'Informe o token no formato \'Authorization: Bearer [token]\'.' })
  jwt.verify(arr[1], SECRET, (err, data) => {
    if (err)
      return res.status(401).json({ message: 'Token inválido.' })
    req.claims = data
    next()
  })
}