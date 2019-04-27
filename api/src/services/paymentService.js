import erros from '../../../crosscutting/errors'

const { throwValidationError } = erros

const validatePayment = async (payment, creditCardRepository) => {
  if (!payment)
    throwValidationError('Pagamento inválido.')

  const { description, firstPaymentDate, installments, fixedPayment, creditCard, type } = payment

  if (!description)
    throwValidationError('A descrição é obrigatória.')

  if (!firstPaymentDate)
    throwValidationError('A data do primeiro pagamento é obrigatória.')

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

export default (repository, creditCardRepository) => {
  if (!repository || !creditCardRepository)
    throw 'Invalid parameter \'repository\''
  return {
    getByUser: (userId) => repository.getByUser(userId),
    create: async (payment) => {
      await validatePayment(payment, creditCardRepository)
      return repository.create(payment)
    },
    update: async (payment) => {
      await validatePayment(payment, creditCardRepository)
      const paymentDb = await repository.getById(payment.id)
      if (!paymentDb || paymentDb.userId !== payment.userId)
        throwValidationError('Pagamento não localizado.')
      return repository.update(payment)
    },
    remove: async (payment) => {
      const paymentDb = await repository.getById(payment.id)
      if (!paymentDb || paymentDb.userId !== payment.userId)
        throwValidationError('Pagamento não localizado.')
      return repository.remove(payment)
    }
  }
}