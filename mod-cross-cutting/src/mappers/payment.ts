import { CreditCard, Payment, PaymentEstimate } from '../models'
import { throwValidationError, toDateFormat } from '../util'

/**
 * @param {Array} arr Lista de pagamentos a serem mapeados
 * @param {String} startDate Dada de início no formato MM/yyyy
 * @param {String} endDate Dada de fim no formato MM/yyyy
 * @param {Array} cards Cartões de crédito do usuário
 */
export const paymentEstimateResult = (arr: Payment[], startDateStr: string, endDateStr: string, cards: CreditCard[]) => {

  const regex = /^\d{1,2}[/]\d{4}$/

  if (!regex.test(startDateStr) || !regex.test(endDateStr))
    throwValidationError('Informe os parametros \'startDate\' e \'endDate\' no formato \'MM/yyyy\'.')

  const startSplited = startDateStr.split('/')
  const endSplited = endDateStr.split('/')
  const startDate = { month: Number(startSplited[0]), year: Number(startSplited[1]) }
  const endDate = { month: Number(endSplited[0]), year: Number(endSplited[1]) }

  if (startDate.month < 1 || startDate.month > 12 || endDate.month < 1 || endDate.month > 12
    || startDate.year > endDate.year || (endDate.year - startDate.year) > 5
    || (startDate.year === endDate.year && endDate.month < startDate.month))
    return {}

  const currDate = {
    month: startDate.month,
    year: startDate.year
  }
  const monthsYear: string[] = []
  do {
    monthsYear.push(`${currDate.month > 9 ? '' : '0'}${currDate.month}/${currDate.year}`)
    currDate.month++
    if (currDate.month > 12) {
      currDate.month = 1
      currDate.year++
    }

  } while (currDate.year < endDate.year
    || (currDate.year === endDate.year && currDate.month <= endDate.month))

  const payments: PaymentEstimate[] = []

  arr.forEach(p => {
    p.installments.forEach(x => {
      payments.push({
        cost: x.cost,
        creditCard: cards.find(y => y.id === p.creditCardId) || new CreditCard(),
        date: x.date,
        description: p.description,
        fixedPayment: p.fixedPayment,
        id: p.id,
        invoice: p.invoice,
        number: x.number,
        userId: p.userId,
        sync: p.sync,
        type: p.type,
        paid: x.paid,
        qtdInstallments: p.installments.length,
        dateFormatted: toDateFormat(x.date, 'dd/MM/yy'),
        monthYear: toDateFormat(x.date, 'MM/yyyy')
      } as PaymentEstimate)
    })
  })

  const fixed = payments.filter(p => p.fixedPayment)
  let accumulatedCost = 0
  const toCost = (val: any) => parseFloat((val).toFixed(2))
  const result: any = {}
  monthsYear.forEach(m => {
    const list = payments.filter(p => p.monthYear === m && !p.fixedPayment).concat(fixed)
    const costIncome = toCost(list.filter(p => p.type === 1).map(p => p.cost).reduce((sum, val) => sum + val))
    const costExpense = toCost(list.filter(p => p.type === 2).map(p => p.cost).reduce((sum, val) => sum + val))
    const total = toCost(costIncome - costExpense)
    accumulatedCost += total
    result[m] = {
      payments: list,
      costIncome,
      costExpense,
      total,
      accumulatedCost: toCost(accumulatedCost)
    }
  })

  return result
}