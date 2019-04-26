import { Payment, Installment, sequelize } from '../sequelize/models'

export default {
  getByUser: (userId) => Payment.findAll({ where: { userId: userId }, include: [Installment] }),
  create: async (payment) => {
    const transaction = await sequelize.transaction()
    try {
      const { description, firstPaymentDate, installments, fixedPayment, creditCard, type, userId } = payment
      const paymentDb = Payment.create({ description, firstPaymentDate, fixedPayment, creditCardId: creditCard.id, type, userId }, { transaction: transaction })
      for (let i of installments) {
        await Installment.create({
          number: i.number,
          const: i.cost,
          date: i.date,
          paymentId: paymentDb.id
        }, { transaction: transaction })
      }
      transaction.commit()
      return Payment.findOne({ where: { paymentId: paymentDb.id }, include: [Installment] })
    } catch (ex) {
      transaction.rollback()
      throw ex
    }
  },
  update: (card) => Payment.update({ name: card.name, description: card.description }, { where: { id: card.id, userId: card.userId } }),
  remove: (card) => Payment.destroy({ where: { id: card.id, userId: card.userId } })
}