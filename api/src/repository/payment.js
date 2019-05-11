import { Payment, Installment, sequelize } from '../sequelize/models'

export default {
  getById: (id) => Payment.findOne({ where: { id: id }, include: [Installment] }),
  getByUser: (userId) => Payment.findAll({ where: { userId: userId }, include: [Installment] }),
  create: async (payment) => {
    const transaction = await sequelize.transaction()
    try {
      const { invoice, description, firstPaymentDate, installments, fixedPayment, creditCard, type, userId } = payment
      const paymentDb = await Payment.create({
        description,
        firstPaymentDate,
        fixedPayment,
        creditCardId: creditCard ? creditCard.id : null,
        type,
        invoice,
        userId
      }, { transaction: transaction })
      for (let i of installments) {
        await Installment.create({
          number: i.number,
          cost: i.cost,
          date: i.date,
          paymentId: paymentDb.id,
          paid: i.paid
        }, { transaction: transaction })
      }
      transaction.commit()
      return Payment.findOne({ where: { id: paymentDb.id }, include: [Installment] })
    } catch (ex) {
      transaction.rollback()
      throw ex
    }
  },
  update: async (payment) => {
    const transaction = await sequelize.transaction()
    try {
      const { id, invoice, description, firstPaymentDate, installments, fixedPayment, creditCard, type } = payment
      await Payment.update({
        description,
        firstPaymentDate,
        fixedPayment,
        invoice,
        creditCardId: creditCard ? creditCard.id : null,
        type
      }, { transaction: transaction, where: { id: id } })
      await Installment.destroy({ where: { paymentId: id }, transaction: transaction })
      for (let i of installments) {
        await Installment.create({
          number: i.number,
          cost: i.cost,
          date: i.date,
          paymentId: id,
          paid: i.paid
        }, { transaction: transaction })
      }
      transaction.commit()
      return Payment.findOne({ where: { id: id }, include: [Installment] })
    } catch (ex) {
      transaction.rollback()
      throw ex
    }
  },
  remove: async (payment) => {
    const transaction = await sequelize.transaction()
    try {
      await Installment.destroy({
        where: { paymentId: payment.id },
        transaction: transaction
      })
      await Payment.destroy({ where: { id: payment.id }, transaction: transaction })
      transaction.commit()
      return null
    } catch (ex) {
      transaction.rollback()
      throw ex
    }
  }
}