import { paymentEstimateResult } from '../mappers'
import { ICreditCardRepository, IPaymentRepository, Payment } from '../models'
import { throwRepositoryError, throwValidationError, } from '../util'
import { validatePayment } from '../validations'

export class PaymentService {
  private repository: IPaymentRepository
  private creditCardRepository: ICreditCardRepository

  constructor(repository: IPaymentRepository, creditCardRepository: ICreditCardRepository) {
    if (!repository || !creditCardRepository)
      throw Error('Invalid parameter \'repository\'')
    this.repository = repository
    this.creditCardRepository = creditCardRepository
  }

  public async getByUser(userId: number) {
    if (!this.repository.getByUser)
      throwRepositoryError('paymentService', 'getByUser')
    const pays = await this.repository.getByUser(userId)
    return pays
  }

  /**
   *
   * @param {Number} userId
   * @param {String} startDate Data de início no formato MM/yyyy
   * @param {String} endDate Data de fim no formato MM/yyyy
   */
  public async getEstimative(userId: number, startDate: string, endDate: string) {
    if (!this.creditCardRepository.getByUser)
      throwRepositoryError('paymentService', 'creditCardRepository.getByUser')
    if (!this.repository.getByUser)
      throwRepositoryError('paymentService', 'paymentRepository.getByUser')
    const payments = await this.repository.getByUser(userId)
    const cards = await this.creditCardRepository.getByUser(userId)
    return paymentEstimateResult(payments, startDate, endDate, cards)
  }

  /**
   * @param {Object} payment
   */
  public async create(payment: Payment) {
    if (!this.repository.create)
      throwRepositoryError('paymentService', 'paymentRepository.create')
    await validatePayment(payment, this.creditCardRepository)
    return this.repository.create(payment)
  }

  /**
   * @param {Object} payment
   */
  public async update(payment: Payment) {
    if (!this.repository.getById)
      throwRepositoryError('paymentService', 'paymentRepository.getById')
    if (!this.repository.update)
      throwRepositoryError('paymentService', 'paymentRepository.update')
    await validatePayment(payment, this.creditCardRepository)
    const paymentDb = await this.repository.getById(payment.id)
    if (!paymentDb || paymentDb.userId !== payment.userId)
      throwValidationError('Pagamento não localizado.')
    return this.repository.update(payment)
  }

  /**
   * @param {Object} payment
   */
  public async remove(payment: Payment) {
    if (!this.repository.remove)
      throwRepositoryError('paymentService', 'paymentRepository.remove')
    const paymentDb = await this.repository.getById(payment.id)
    if (!paymentDb || paymentDb.userId !== payment.userId)
      throwValidationError('Pagamento não localizado.')
    return this.repository.remove(payment)
  }
}