import erros from '../../../crosscutting/errors'
import { toDateFormat } from '../util/date'

const { throwValidationError } = erros

const validatePayment = async (payment, creditCardRepository) => {
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

const toPaymentResult = (arr, startDate, endDate) => {
  const regex = /^\d{1,2}[/]\d{4}$/
  const result = {}

  if (!regex.test(startDate) || !regex.test(endDate))
    throwValidationError('Informe os parametros \'startDate\' e \'endDate\' no formato \'MM/yyyy\'.')

  startDate = startDate.split('/')
  startDate = { month: Number(startDate[0]), year: Number(startDate[1]) }
  endDate = endDate.split('/')
  endDate = { month: Number(endDate[0]), year: Number(endDate[1]) }

  if (startDate.month < 1 || startDate.month > 12 || endDate.month < 1 || endDate.month > 12
    || startDate.year > endDate.year || (endDate.year - startDate.year) > 5
    || (startDate.year === endDate.year && endDate.month < startDate.month))
    return {}

  const currDate = {
    month: startDate.month,
    year: startDate.year
  }

  do {
    const curr = `${currDate.month > 9 ? '' : '0'}${currDate.month}/${currDate.year}`
    result[curr] = []
    currDate.month++
    if (currDate.month > 12) {
      currDate.month = 1
      currDate.year++
    }

  } while (currDate.year < endDate.year
    || (currDate.year === endDate.year && currDate.month <= endDate.month))

  const payments = []

  arr.forEach(p => {
    p.Installments.forEach(x => {
      payments.push({
        id: p.id,
        description: p.description,
        userId: p.userId,
        type: p.type,
        creditCardId: p.creditCardId,
        fixedPayment: p.fixedPayment,
        invoice: p.invoice,
        sync: p.sync,
        cost: x.cost,
        number: x.number,
        date: x.date,
        dateFormatted: toDateFormat(x.date, 'dd/MM/yy'),
        monthYear: toDateFormat(x.date, 'MM/yyyy')
      })
    })
  })
  const fixed = payments.filter(p => p.fixedPayment)
  let accumulatedCost = 0
  const toCost = (val) => parseFloat((val).toFixed(2))
  for (let month in result) {
    const list = payments.filter(p => p.monthYear === month && !p.fixedPayment).concat(fixed)
    const costIncome = toCost(list.filter(p => p.type === 1).map(p => p.cost).reduce((sum, val) => sum + val))
    const costExpense = toCost(list.filter(p => p.type === 2).map(p => p.cost).reduce((sum, val) => sum + val))
    const total = toCost(costIncome - costExpense)
    accumulatedCost += total
    result[month] = {
      payments: list,
      costIncome,
      costExpense,
      total,
      accumulatedCost: toCost(accumulatedCost)
    }
  }

  return result
}

export default (repository, creditCardRepository) => {
  if (!repository || !creditCardRepository)
    throw 'Invalid parameter \'repository\''
  return {
    getByUser: (userId) => repository.getByUser(userId),
    getEstimative: async (userId, startDate, endDate) => {
      const payments = await repository.getByUser(userId)
      return toPaymentResult(payments, startDate, endDate)
    },
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