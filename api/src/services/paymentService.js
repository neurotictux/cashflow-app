import erros from '../../../crosscutting/errors'

const { throwValidationError } = erros
const repository = {}

const validatePayment = (payment) => {
  if (!payment)
    throwValidationError('Pagamento inválido.')

  const { description, firstPaymentDate, installments, fixedPayment, creditCard, type } = payment

  if (!description)
    throwValidationError('A descrição é obrigatória.')

  if (!firstPaymentDate)
    throwValidationError('A data do primeiro pagamento é obrigatória.')

  if (type !== 1 && type !== 2)
    throwValidationError('O tipo do pagamento deve \'1\' para RENDA ou \'2\' para DESPESA.')

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

    p.date = new Date(p.date || '')
    if (p.date.toString() === 'Invalid Date')
      throwValidationError('Há parcelas com data inválida.')
  })

  if (creditCard && creditCard.id) {
    const card = repository.GetById(creditCard.id)
    if (!card)
      throwValidationError('Cartão não localizado.')
    else if (card.userId !== payment.userId)
      throwValidationError('Cartão não pertence ao usuário.')
  }
}

export default (repository) => {
  if (!repository)
    throw 'Invalid parameter \'repository\''
  return {
    getByUser: (userId) => repository.getByUser(userId),
    create: async (payment) => {
      validatePayment(payment)
      return repository.create(payment)
    }
  }
}