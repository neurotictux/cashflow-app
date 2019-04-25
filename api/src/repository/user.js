import { User } from '../sequelize/models'

export default {
  getUserData: (userId) => User.findOne({ where: { id: userId } }),
  getByEmail: (email) => User.findOne({ where: { email: email } }),
  create: (user) => User.create({ name: user.name, email: user.email, password: user.password, createdAt: new Date }),
  update: (user) => User.update({ name: user.name, email: user.email, updatedAt: new Date() }, { where: { id: user.id } }),
  updatePassword: (user) => User.update({ password: user.password, updatedAt: new Date() }, { where: { id: user.id } })
}