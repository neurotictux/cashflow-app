import { CreditCard } from '../sequelize/models'

export default {
  getByUser: (userId) => CreditCard.findAll({ where: { userId: userId } }),
  create: (card) => CreditCard.create({ name: card.name, description: card.description, userId: card.userId }),
  update: (card) => CreditCard.update({ name: card.name, description: card.description }, { where: { id: card.id, userId: card.userId } }),
  remove: (card) => CreditCard.destroy({ where: { id: card.id, userId: card.userId } })
}