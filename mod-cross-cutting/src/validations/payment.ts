import { ICreditCardRepository } from '../models'
import { Payment } from '../models'
import { throwValidationError } from '../util'

export const validatePayment = async (payment: Payment, creditCardRepository: ICreditCardRepository) => {
  if (!payment)
    throwValidationError('Pagamento inválido.')

  const { description, installments, fixedPayment, creditCard, type } = payment

  if (!description)
    throwValidationError('A descrição é obrigatória.')

  if (type !== 1 && type !== 2)
    throwValidationError('O tipo do pagamento deve ser \'1\' para RENDA ou \'2\' para DESPESA.')

  if (!Array.isArray(installments) || !installments.length)
    throwValidationError('O pagamento deve ter pelo menos 1 parcela.')

  if (fixedPayment && installments.length > 1)
    throwValidationError('Pagamento fixo não pode ter mais de 1 parcela.')

  if (installments.map(p => p.number).filter((p, i, arr) => arr.indexOf(p) !== i).length)
    throwValidationError('Há mais de uma parcela com o mesmo número de prestação.')

  installments.forEach(p => {
    if (!p.number || isNaN(Number(p.number)))
      throwValidationError('Há parcelas sem número.')

    if (!p.cost || isNaN(Number(p.cost)))
      throwValidationError('Há parcelas sem valor.')
    p.cost = parseFloat((p.cost).toFixed(2))

    p.date = new Date(p.date || '')
    if (p.date.toString() === 'Invalid Date')
      throwValidationError('Há parcelas com data inválida.')
  })

  if (creditCard && creditCard.id) {
    const cards = await creditCardRepository.getByUser(payment.userId)
    if (!cards.filter(p => p.id === creditCard.id).length)
      throwValidationError('Cartão não localizado.')
  }
}