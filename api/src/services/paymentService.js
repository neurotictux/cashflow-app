import erros from '../../../crosscutting/errors'

const { throwValidationError } = erros
const repository = {}

const validatePayment = (payment) => {
  if (!payment)
    throwValidationError('Pagamento inválido.')

  if (!payment.description)
    throwValidationError('A descrição é obrigatória.')

  if (!payment.firstPaymentDate)
    throwValidationError('A data do primeiro pagamento é obrigatória.')

  if (payment.installment <= 0)
    throwValidationError('O pagamento deve ter pelo menos 1 parcela.')

  if (payment.creditCard && payment.CreditCard.id) {
    const card = repository.GetById(payment.CreditCard.id)
    if (!card)
      throwValidationError('Cartão não localizado.')
  }
}

export default (repository) => {
  if (!repository)
    throw 'Invalid parameter \'repository\''
  return {
    create: (payment) => {
      validatePayment(payment)
      return repository.create(payment)
    }
  }
}