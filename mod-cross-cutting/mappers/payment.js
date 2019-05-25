import { toDateFormat, throwValidationError } from '../util'

/**
 * 
 * @param {Array} arr Lista de pagamentos a serem mapeados
 * @param {String} startDate Dada de início no formato MM/yyyy
 * @param {String} endDate Dada de fim no formato MM/yyyy
 * @param {Array} cards Cartões de crédito do usuário
 */
export const paymentEstimateResult = (arr, startDate, endDate, cards) => {
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
        creditCard: cards.find(x => x.id === p.creditCardId),
        fixedPayment: p.fixedPayment,
        invoice: p.invoice,
        sync: p.sync,
        cost: x.cost,
        number: x.number,
        date: x.date,
        paid: x.paid,
        qtdInstallments: p.Installments.length,
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