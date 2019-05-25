import { throwValidationError, throwRepositoryError } from '../util'
import { paymentEstimateResult } from '../mappers'
import { validatePayment } from '../validations'

// /**
//  * @param {Object} repository Repositório de pagamentos
//  * @param {Object} creditCardRepository Repositório de cartões de crédito
//  */
/**
 * 
 * @param {object} repository 
 * @param {object} creditCardRepository 
 */
export const createPaymentService = (repository, creditCardRepository) => {

  if (!repository || !creditCardRepository)
    throw 'Invalid parameter \'repository\''

  return {
    /**
     * 
     * @param {Number} userId
     */
    getByUser: async (userId) => {
      if (!repository.getByUser)
        throwRepositoryError('paymentService', 'getByUser')
      const pays = await repository.getByUser(userId)
      return pays
    },

    /**
     * 
     * @param {Number} userId 
     * @param {String} startDate Data de início no formato MM/yyyy
     * @param {String} endDate Data de fim no formato MM/yyyy
     */
    getEstimative: async (userId, startDate, endDate) => {
      if (!creditCardRepository.getByUser)
        throwRepositoryError('paymentService', 'creditCardRepository.getByUser')
      if (!repository.getByUser)
        throwRepositoryError('paymentService', 'paymentRepository.getByUser')
      const payments = await repository.getByUser(userId)
      const cards = await creditCardRepository.getByUser(userId)
      return paymentEstimateResult(payments, startDate, endDate, cards)
    },

    /**
     * @param {Object} payment
     */
    create: async (payment) => {
      if (!repository.create)
        throwRepositoryError('paymentService', 'paymentRepository.create')
      await validatePayment(payment, creditCardRepository)
      return repository.create(payment)
    },

    /**
     * @param {Object} payment 
     */
    update: async (payment) => {
      if (!repository.getById)
        throwRepositoryError('paymentService', 'paymentRepository.getById')
      if (!repository.update)
        throwRepositoryError('paymentService', 'paymentRepository.update')
      await validatePayment(payment, creditCardRepository)
      const paymentDb = await repository.getById(payment.id)
      if (!paymentDb || paymentDb.userId !== payment.userId)
        throwValidationError('Pagamento não localizado.')
      return repository.update(payment)
    },

    /**
     * @param {Object} payment 
     */
    remove: async (payment) => {
      if (!repository.remove)
        throwRepositoryError('paymentService', 'paymentRepository.remove')
      const paymentDb = await repository.getById(payment.id)
      if (!paymentDb || paymentDb.userId !== payment.userId)
        throwValidationError('Pagamento não localizado.')
      return repository.remove(payment)
    }
  }
}